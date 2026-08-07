import { Request, Response } from 'express';
import { backendSanityClient } from '../lib/sanity/sanity.js';
import { extractTextFromDocxBuffer } from '../lib/docxText.js';
import { parseQuestions } from '../lib/questionParser.js';

// READ-ONLY with respect to Sanity — this endpoint never writes anything.
// It downloads the Word file the editor uploaded to the test document,
// extracts + parses the questions, and hands them back so Sanity Studio
// can show a preview. The actual write happens from Studio itself, using
// the logged-in editor's own session
// (see studio/actions/wordQuestionExtractAction.tsx).
export async function handleExtractQuestionsPreview(req: Request, res: Response) {
  const { testId } = req.body;

  if (!testId) {
    return res.status(400).json({ success: false, error: 'Missing testId' });
  }

  try {
    const testDoc = await backendSanityClient.fetch(
      `*[_id == $testId][0]{ _id, title, "wordFileUrl": questionWordUpload.asset->url }`,
      { testId }
    );

    if (!testDoc) {
      return res.status(404).json({ success: false, error: 'Test document not found.' });
    }

    if (!testDoc.wordFileUrl) {
      return res.status(400).json({
        success: false,
        error: 'No Word file uploaded on this test yet. Upload one to the "Question Word File" field first, then save.',
      });
    }

    const fileResponse = await fetch(testDoc.wordFileUrl);
    if (!fileResponse.ok) {
      return res.status(502).json({ success: false, error: 'Could not download the Word file from Sanity.' });
    }
    const arrayBuffer = await fileResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const text = await extractTextFromDocxBuffer(buffer);
    const { questions, warnings } = parseQuestions(text);

    if (questions.length === 0) {
      return res.status(422).json({
        success: false,
        error:
          'No valid questions could be parsed from this file. Make sure each question follows the Q1 / Option A-D / Answer format.',
        warnings,
      });
    }

    return res.json({
      success: true,
      testTitle: testDoc.title,
      questions,
      warnings,
    });
  } catch (err: any) {
    console.warn('Error extracting questions from Word file:', err);
    return res.status(500).json({ success: false, error: 'Failed to process the Word file. Please try again.' });
  }
}