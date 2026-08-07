// src/lib/questionParser.ts
//
// Parses raw text (from a .docx OR a .pdf, doesn't matter — both are
// reduced to plain text before reaching this file) into question blocks.
//
// Expected format per question:
//
//   Q1
//   What is the synonym of "Happy"?
//   Option A: Sad
//   Option B: Joyful
//   Option C: Angry
//   Option D: Tired
//   Answer: B
//
// Tolerant of "Q1." / "Q1:" / "A) X" / "Answer - B" style variations too.

export interface ParsedQuestion {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

export interface ParseWarning {
  message: string;
}

export interface ParseResult {
  questions: ParsedQuestion[];
  warnings: ParseWarning[];
}

const Q_NUMBER_RE = /^Q\s*\d+\s*[:.\-]?\s*(.*)$/i;
const OPTION_RE = /^(?:option\s*)?([ABCD])\s*[:.)\-]\s*(.+)$/i;
const ANSWER_RE = /^(?:correct\s*)?answer\s*[:.\-]\s*([ABCD])\b/i;

export function parseQuestions(rawText: string): ParseResult {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const questions: ParsedQuestion[] = [];
  const warnings: ParseWarning[] = [];

  let current:
    | (Partial<ParsedQuestion> & { questionLines?: string[] })
    | null = null;
  let collectingQuestionText = false;

  function flush() {
    if (!current) return;
    const questionText = (current!.questionLines || []).join(' ').trim();
    if (
      questionText &&
      current!.optionA &&
      current!.optionB &&
      current!.optionC &&
      current!.optionD &&
      current!.correctAnswer
    ) {
      questions.push({
        questionText,
        optionA: current!.optionA!,
        optionB: current!.optionB!,
        optionC: current!.optionC!,
        optionD: current!.optionD!,
        correctAnswer: current!.correctAnswer!,
      });
    } else if (questionText || current!.optionA) {
      warnings.push({
        message: `Skipped an incomplete question near: "${questionText.slice(0, 60) || '(no text)'}" — missing question text, one of the 4 options, or the answer line.`,
      });
    }
    current = null;
    collectingQuestionText = false;
  }

  for (const line of lines) {
    const qMatch = line.match(Q_NUMBER_RE);
    if (qMatch) {
      flush();
      current = { questionLines: [] };
      collectingQuestionText = true;
      if (qMatch[1] && qMatch[1].trim()) {
        current.questionLines!.push(qMatch[1].trim());
      }
      continue;
    }

    if (!current) continue;

    const optMatch = line.match(OPTION_RE);
    if (optMatch) {
      collectingQuestionText = false;
      const letter = optMatch[1].toUpperCase();
      const text = optMatch[2].trim();
      if (letter === 'A') current.optionA = text;
      else if (letter === 'B') current.optionB = text;
      else if (letter === 'C') current.optionC = text;
      else if (letter === 'D') current.optionD = text;
      continue;
    }

    const ansMatch = line.match(ANSWER_RE);
    if (ansMatch) {
      collectingQuestionText = false;
      current.correctAnswer = ansMatch[1].toUpperCase() as 'A' | 'B' | 'C' | 'D';
      continue;
    }

    if (collectingQuestionText) {
      current.questionLines!.push(line);
    }
  }
  flush();

  return { questions, warnings };
}