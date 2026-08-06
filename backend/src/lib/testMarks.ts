// src/lib/testMarks.ts
//
// Single source of truth for all marks/score math on the backend.
// Nothing in testController.ts should compute score or marksPerQuestion
// by hand — always go through these functions.

/**
 * Round a number to 2 decimal places (avoids floating point artifacts
 * like 33.330000000000005).
 */
export function roundTo2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * marksPerQuestion = totalMarks / totalQuestions
 * Returns 0 for a degenerate test (no questions) instead of throwing/NaN.
 */
export function computeMarksPerQuestion(totalMarks: number, totalQuestions: number): number {
  if (!totalQuestions || totalQuestions <= 0) return 0;
  return roundTo2(totalMarks / totalQuestions);
}

/**
 * score = correctCount * marksPerQuestion
 */
export function computeScore(correctCount: number, marksPerQuestion: number): number {
  return roundTo2(correctCount * marksPerQuestion);
}

export interface MarksBreakdown {
  totalMarks: number;
  totalQuestions: number;
  marksPerQuestion: number;
}

/**
 * Resolve the totalMarks for a test from whatever sources are available,
 * in priority order, without ever falling back to a hardcoded "50".
 *
 * Priority:
 *   1. The Sanity test document's `marks` field (source of truth).
 *   2. The static fallback dataset's `marks` field (used only when Sanity
 *      has no test doc / no marks at all — e.g. local dev without CMS).
 *   3. 1 mark per question — a neutral, test-size-proportional default
 *      instead of an arbitrary fixed number.
 */
export function resolveTotalMarks(
  sanityMarks: number | undefined | null,
  fallbackMarks: number | undefined | null,
  totalQuestions: number
): number {
  if (typeof sanityMarks === 'number' && sanityMarks > 0) return sanityMarks;
  if (typeof fallbackMarks === 'number' && fallbackMarks > 0) return fallbackMarks;
  return totalQuestions; // 1 mark/question, never a fixed magic number
}

export function buildMarksBreakdown(
  sanityMarks: number | undefined | null,
  fallbackMarks: number | undefined | null,
  totalQuestions: number
): MarksBreakdown {
  const totalMarks = resolveTotalMarks(sanityMarks, fallbackMarks, totalQuestions);
  const marksPerQuestion = computeMarksPerQuestion(totalMarks, totalQuestions);
  return { totalMarks, totalQuestions, marksPerQuestion };
}