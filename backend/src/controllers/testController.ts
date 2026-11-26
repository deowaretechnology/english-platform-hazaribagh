import { Request, Response } from 'express';
import { backendSanityClient } from '../lib/sanity/sanity.js';
import { connectToDatabase } from '../lib/db/mongodb.js';
import { TestAttempt } from '../lib/db/models.js';
import { testsData } from '../data/tests.js';
import { buildMarksBreakdown, computeScore } from '../lib/testMarks.js';

function extractOptions(q: any): string[] {
  if (Array.isArray(q.options) && q.options.length > 0) {
    const filtered = q.options
      .filter((o: any) => o !== undefined && o !== null && String(o).trim().length > 0)
      .map((o: any) => String(o).trim());
    if (filtered.length > 0) return filtered;
  }
  const opts: string[] = [];
  if (q.optionA && String(q.optionA).trim()) opts.push(String(q.optionA).trim());
  if (q.optionB && String(q.optionB).trim()) opts.push(String(q.optionB).trim());
  if (q.optionC && String(q.optionC).trim()) opts.push(String(q.optionC).trim());
  if (q.optionD && String(q.optionD).trim()) opts.push(String(q.optionD).trim());

  if (opts.length > 0) return opts;

  if (q.a) opts.push(String(q.a).trim());
  if (q.b) opts.push(String(q.b).trim());
  if (q.c) opts.push(String(q.c).trim());
  if (q.d) opts.push(String(q.d).trim());

  return opts;
}

function extractCorrectIndex(q: any, options: string[]): number {
  const rawAns = q.correctAnswer !== undefined && q.correctAnswer !== null
    ? q.correctAnswer
    : (q.correctOption !== undefined && q.correctOption !== null ? q.correctOption : 0);

  const strAns = String(rawAns).trim();

  if (/^[0-3]$/.test(strAns)) {
    return parseInt(strAns, 10);
  }

  const upper = strAns.toUpperCase();
  if (upper === 'A' || upper === 'OPTION A' || upper === 'OPTIONA') return 0;
  if (upper === 'B' || upper === 'OPTION B' || upper === 'OPTIONB') return 1;
  if (upper === 'C' || upper === 'OPTION C' || upper === 'OPTIONC') return 2;
  if (upper === 'D' || upper === 'OPTION D' || upper === 'OPTIOND') return 3;

  if (options && options.length > 0) {
    const idx = options.findIndex(opt => opt.trim().toLowerCase() === strAns.toLowerCase());
    if (idx !== -1) return idx;
  }

  return 0;
}

// Single query used by both endpoints so title/classLevel/marks/duration
// and inline questions are always read from the same place.
const TEST_DOC_QUERY = `*[_type in ["test", "tests", "mockTest"] && (slug.current == $slug || _id == $slug)][0] {
  _id,
  title,
  classLevel,
  marks,
  durationMinutes,
  questions[] {
    _key,
    _id,
    questionText,
    question,
    options,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    correctOption,
    explanation
  }
}`;

const STANDALONE_QUESTIONS_QUERY = `*[_type == "question" && (testRef->slug.current == $slug || testRef->_id == $slug || classLevel == $slug || testSlug == $slug)] {
  _id,
  questionText,
  question,
  options,
  optionA,
  optionB,
  optionC,
  optionD,
  correctAnswer,
  correctOption,
  explanation
}`;

export async function handleGetTestQuestions(req: Request, res: Response) {
  const { slug } = req.params;
  const matchedTest = testsData.find(t => t.id === slug) || testsData[0];

  let testDoc: any = null;
  let rawQuestions: any[] = [];

  try {
    testDoc = await backendSanityClient.fetch(TEST_DOC_QUERY, { slug });

    if (testDoc && Array.isArray(testDoc.questions) && testDoc.questions.length > 0) {
      rawQuestions = testDoc.questions;
    } else {
      const standalone: any[] = await backendSanityClient.fetch(STANDALONE_QUESTIONS_QUERY, { slug });
      if (standalone && standalone.length > 0) {
        rawQuestions = standalone;
      }
    }
  } catch (err) {
    console.warn('Error fetching questions from Sanity:', err);
  }

  let sanitized: { id: string; questionText: string; options: string[] }[];

  if (rawQuestions.length > 0) {
    sanitized = rawQuestions.map((q: any, idx: number) => ({
      id: q._id || q._key || `q-${idx}`,
      questionText: q.questionText || q.question || `Question ${idx + 1}`,
      options: extractOptions(q)
    }));
  } else {
    // Fallback to static test data if Sanity has no questions yet
    const fallbackQs = matchedTest ? matchedTest.questions || [] : [];
    sanitized = fallbackQs.map((q: any) => ({
      id: q.id,
      questionText: q.question,
      options: q.options
    }));
  }

  const totalQuestions = sanitized.length;
  const { totalMarks, marksPerQuestion } = buildMarksBreakdown(
    testDoc?.marks,
    matchedTest?.marks,
    totalQuestions
  );

  return res.json({
    success: true,
    questions: sanitized,
    testInfo: {
      title: testDoc?.title || matchedTest?.title || slug.toUpperCase().replace(/-/g, ' '),
      class: testDoc?.classLevel || matchedTest?.class || '10',
      totalQuestions,
      totalMarks,
      marksPerQuestion,
      durationMinutes: testDoc?.durationMinutes || matchedTest?.durationMinutes || 30
    }
  });
}

export async function handleEvaluateTest(req: Request, res: Response) {
  const { userId, slug, userAnswers } = req.body;

  if (!userAnswers) {
    return res.status(400).json({ error: 'Missing user answers' });
  }

  const matchedTest = testsData.find(t => t.id === slug) || testsData[0];
  let testTitle = matchedTest ? matchedTest.title : slug.toUpperCase().replace(/-/g, ' ');
  let classLevel = matchedTest ? matchedTest.class : '10';
  let sanityMarks: number | undefined;

  let realQuestions: any[] = [];

  try {
    const testDoc: any = await backendSanityClient.fetch(TEST_DOC_QUERY, { slug });
    if (testDoc) {
      if (testDoc.title) testTitle = testDoc.title;
      if (testDoc.classLevel) classLevel = testDoc.classLevel;
      if (typeof testDoc.marks === 'number') sanityMarks = testDoc.marks;
      if (Array.isArray(testDoc.questions) && testDoc.questions.length > 0) {
        realQuestions = testDoc.questions;
      }
    }

    if (realQuestions.length === 0) {
      const fetched: any[] = await backendSanityClient.fetch(STANDALONE_QUESTIONS_QUERY, { slug });
      if (fetched && fetched.length > 0) {
        realQuestions = fetched;
      }
    }
  } catch (err) {
    console.warn('Error fetching evaluation questions from Sanity:', err);
  }

  let correctCount = 0;
  let totalQuestions = 0;
  let breakdown: any[] = [];
  let snapshotQuestions: any[] = [];

  if (realQuestions.length === 0) {
    const fallbackQs = matchedTest ? (matchedTest.questions || []) : [];
    totalQuestions = fallbackQs.length;

    breakdown = fallbackQs.map((q, idx) => {
      const qId = q.id || `q-${idx}`;
      const userSelectedIdx = userAnswers[qId] !== undefined ? userAnswers[qId] : userAnswers[idx];
      const userSelectedText = typeof userSelectedIdx === 'number' && q.options[userSelectedIdx] !== undefined
        ? q.options[userSelectedIdx]
        : 'Not Answered';
      const correctText = q.options[q.correctAnswer] || q.options[0];
      const isCorrect = userSelectedIdx === q.correctAnswer;

      if (isCorrect) correctCount++;

      snapshotQuestions.push({
        questionText: q.question,
        options: q.options || [],
        correctOption: q.correctAnswer,
        studentAnswer: typeof userSelectedIdx === 'number' ? userSelectedIdx : -1,
        isCorrect
      });

      return {
        questionId: qId,
        questionText: q.question,
        userAnswer: userSelectedText,
        correctAnswer: correctText,
        isCorrect,
        explanation: q.explanation || 'Detailed grammar rules & textbook reference.'
      };
    });
  } else {
    totalQuestions = realQuestions.length;
    breakdown = realQuestions.map((q, idx) => {
      const qId = q._id || q._key || `q-${idx}`;
      const options = extractOptions(q);
      const correctIdx = extractCorrectIndex(q, options);
      const correctText = options[correctIdx] || `Option ${String.fromCharCode(65 + correctIdx)}`;

      const userSelected = userAnswers[qId] !== undefined ? userAnswers[qId] : userAnswers[idx];

      let userSelectedText = 'Not Answered';
      let studentOptionIndex = -1;

      if (typeof userSelected === 'number' && options[userSelected] !== undefined) {
        studentOptionIndex = userSelected;
        userSelectedText = options[studentOptionIndex];
      } else if (typeof userSelected === 'string') {
        userSelectedText = userSelected;
        studentOptionIndex = options.findIndex(o => o.trim().toLowerCase() === userSelected.trim().toLowerCase());
      }

      const isCorrect = studentOptionIndex === correctIdx;

      if (isCorrect) correctCount++;

      snapshotQuestions.push({
        questionText: q.questionText || q.question || `Question ${idx + 1}`,
        options: options,
        correctOption: correctIdx,
        studentAnswer: studentOptionIndex,
        isCorrect
      });

      return {
        questionId: qId,
        questionText: q.questionText || q.question || `Question ${idx + 1}`,
        userAnswer: userSelectedText,
        correctAnswer: correctText,
        isCorrect,
        explanation: q.explanation || 'Refer to English Platform Class Notes for detailed rules.'
      };
    });
  }

  // ---- Dynamic marks calculation (the whole point of this refactor) ----
  const { totalMarks, marksPerQuestion } = buildMarksBreakdown(
    sanityMarks,
    matchedTest?.marks,
    totalQuestions
  );
  const score = computeScore(correctCount, marksPerQuestion);
  const percentage = Math.round((correctCount / (totalQuestions || 1)) * 100) || 0;
  const percentile = Math.min(99, Math.round(percentage + 7.5));

  // Every submission is stored as a NEW record, so a student can take the same
  // test many times and every result stays in their profile history.
  let attemptNumber = 1;
  try {
    const db = await connectToDatabase();
    if (db) {
      const studentKey = userId || 'anonymous_student';
      const previousCount = await TestAttempt.countDocuments({
        testSlug: slug,
        $or: [{ userId: studentKey }, { userPhone: studentKey }]
      } as any);
      attemptNumber = previousCount + 1;

      await TestAttempt.create({
        userId: userId || 'anonymous_student',
        userPhone: userId,
        testSlug: slug,
        testTitle: testTitle,
        classLevel: classLevel,
        score,
        totalMarks,
        marksPerQuestion,
        correctCount,
        totalQuestions,
        accuracyPercent: percentage,
        questions: snapshotQuestions,
        submittedAt: new Date()
      });
    }
  } catch (dbErr) {
    console.warn('Could not save TestAttempt to MongoDB:', dbErr);
  }

  return res.json({
    success: true,
    testTitle,
    classLevel,
    correctCount,
    totalQuestions,
    score,
    totalMarks,
    marksPerQuestion,
    percentage,
    percentile,
    attemptNumber,
    breakdown
  });
}

// Retakes are allowed. This endpoint no longer blocks the student; it only
// reports how many times the test was attempted before and the latest attempt.
export async function handleCheckTestAttempt(req: Request, res: Response) {
  const { slug, userId } = req.params;

  if (!slug || !userId) {
    return res.json({ success: true, attempted: false, attemptCount: 0 });
  }

  try {
    const db = await connectToDatabase();
    if (db) {
      const filter = { testSlug: slug, $or: [{ userId: userId }, { userPhone: userId }] } as any;
      const attemptCount = await TestAttempt.countDocuments(filter);
      const latest: any = await TestAttempt.findOne(filter).sort({ submittedAt: -1 } as any).lean();

      if (latest) {
        return res.json({
          success: true,
          attempted: true,
          canRetake: true,
          attemptCount,
          attempt: {
            id: latest._id.toString(),
            testSlug: latest.testSlug,
            testTitle: latest.testTitle,
            classLevel: latest.classLevel,
            score: latest.score,
            totalMarks: latest.totalMarks,
            marksPerQuestion: latest.marksPerQuestion,
            totalQuestions: latest.totalQuestions,
            accuracyPercent: latest.accuracyPercent,
            submittedAt: latest.submittedAt
          }
        });
      }
    }
  } catch (err) {
    console.warn('Error checking test attempt in MongoDB:', err);
  }

  return res.json({ success: true, attempted: false, attemptCount: 0 });
}