import { Request, Response } from 'express';
import { backendSanityClient } from '../lib/sanity/sanity.js';
import { connectToDatabase } from '../lib/db/mongodb.js';
import { TestAttempt } from '../lib/db/models.js';
import { testsData } from '../../../src/data/tests.js';

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

  // 1. Direct index string/number '0', '1', '2', '3'
  if (/^[0-3]$/.test(strAns)) {
    return parseInt(strAns, 10);
  }

  // 2. Letter indicators 'A', 'B', 'C', 'D' or 'Option A', 'optionA', etc.
  const upper = strAns.toUpperCase();
  if (upper === 'A' || upper === 'OPTION A' || upper === 'OPTIONA') return 0;
  if (upper === 'B' || upper === 'OPTION B' || upper === 'OPTIONB') return 1;
  if (upper === 'C' || upper === 'OPTION C' || upper === 'OPTIONC') return 2;
  if (upper === 'D' || upper === 'OPTION D' || upper === 'OPTIOND') return 3;

  // 3. Exact string match in options array
  if (options && options.length > 0) {
    const idx = options.findIndex(opt => opt.trim().toLowerCase() === strAns.toLowerCase());
    if (idx !== -1) return idx;
  }

  return 0;
}

export async function handleGetTestQuestions(req: Request, res: Response) {
  const { slug } = req.params;

  try {
    // 1. Check if test document has inline questions
    const testDocQuery = `*[_type in ["test", "tests", "mockTest"] && (slug.current == $slug || _id == $slug)][0] {
      _id,
      title,
      classLevel,
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
    const testDoc = await backendSanityClient.fetch(testDocQuery, { slug });

    if (testDoc && Array.isArray(testDoc.questions) && testDoc.questions.length > 0) {
      const sanitized = testDoc.questions.map((q: any, idx: number) => ({
        id: q._id || q._key || `q-${idx}`,
        questionText: q.questionText || q.question || `Question ${idx + 1}`,
        options: extractOptions(q)
      }));
      return res.json({
        success: true,
        questions: sanitized,
        testInfo: {
          title: testDoc.title || slug.toUpperCase().replace(/-/g, ' '),
          class: testDoc.classLevel || '10'
        }
      });
    }

    // 2. Fetch standalone question documents
    const query = `*[_type == "question" && (testRef->slug.current == $slug || testRef->_id == $slug || classLevel == $slug || testSlug == $slug)] {
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
    const rawQuestions: any[] = await backendSanityClient.fetch(query, { slug });

    if (rawQuestions && rawQuestions.length > 0) {
      const sanitized = rawQuestions.map((q, idx) => ({
        id: q._id || `q-${idx}`,
        questionText: q.questionText || q.question || `Question ${idx + 1}`,
        options: extractOptions(q)
      }));
      return res.json({ success: true, questions: sanitized });
    }
  } catch (err) {
    console.warn('Error fetching questions from Sanity:', err);
  }

  // Fallback to static test data if Sanity has no questions yet
  const matchedTest = testsData.find(t => t.id === slug) || testsData[0];
  const questions = matchedTest ? matchedTest.questions || [] : [];

  const sanitizedFallback = questions.map(q => ({
    id: q.id,
    questionText: q.question,
    options: q.options
  }));

  return res.json({ success: true, questions: sanitizedFallback, testInfo: matchedTest });
}

export async function handleEvaluateTest(req: Request, res: Response) {
  const { userId, slug, userAnswers } = req.body;

  if (!userAnswers) {
    return res.status(400).json({ error: 'Missing user answers' });
  }

  let realQuestions: any[] = [];
  const matchedTest = testsData.find(t => t.id === slug) || testsData[0];
  let testTitle = matchedTest ? matchedTest.title : slug.toUpperCase().replace(/-/g, ' ');
  let classLevel = matchedTest ? matchedTest.class : '10';

  try {
    // 1. Check test doc with inline questions first
    const testDocQuery = `*[_type in ["test", "tests", "mockTest"] && (slug.current == $slug || _id == $slug)][0] {
      _id,
      title,
      classLevel,
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
    const testDoc = await backendSanityClient.fetch(testDocQuery, { slug });
    if (testDoc) {
      if (testDoc.title) testTitle = testDoc.title;
      if (testDoc.classLevel) classLevel = testDoc.classLevel;
      if (Array.isArray(testDoc.questions) && testDoc.questions.length > 0) {
        realQuestions = testDoc.questions;
      }
    }

    // 2. Fallback to standalone question documents
    if (realQuestions.length === 0) {
      const query = `*[_type == "question" && (testRef->slug.current == $slug || testRef->_id == $slug || classLevel == $slug || testSlug == $slug)] {
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
      const fetched = await backendSanityClient.fetch(query, { slug });
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

  const score = Math.round((correctCount / (totalQuestions || 1)) * 50);
  const percentage = Math.round((correctCount / (totalQuestions || 1)) * 100) || 0;
  const percentile = Math.min(99, Math.round(percentage + 7.5));

  try {
    const db = await connectToDatabase();
    if (db) {
      await TestAttempt.create({
        userId: userId || 'anonymous_student',
        userPhone: userId,
        testSlug: slug,
        testTitle: testTitle,
        classLevel: classLevel,
        score: score,
        totalQuestions: totalQuestions,
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
    totalMarks: (matchedTest && matchedTest.marks) || 50,
    percentage,
    percentile,
    breakdown
  });
}

export async function handleCheckTestAttempt(req: Request, res: Response) {
  const { slug, userId } = req.params;

  if (!slug || !userId) {
    return res.json({ success: true, attempted: false });
  }

  try {
    const db = await connectToDatabase();
    if (db) {
      const attempt: any = await TestAttempt.findOne({
        testSlug: slug,
        $or: [{ userId: userId }, { userPhone: userId }]
      } as any).lean();

      if (attempt) {
        return res.json({
          success: true,
          attempted: true,
          attempt: {
            id: attempt._id.toString(),
            testSlug: attempt.testSlug,
            testTitle: attempt.testTitle,
            classLevel: attempt.classLevel,
            score: attempt.score,
            totalQuestions: attempt.totalQuestions,
            accuracyPercent: attempt.accuracyPercent,
            submittedAt: attempt.submittedAt
          }
        });
      }
    }
  } catch (err) {
    console.warn('Error checking test attempt in MongoDB:', err);
  }

  return res.json({ success: true, attempted: false });
}
