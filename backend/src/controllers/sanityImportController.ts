import { Request, Response } from 'express';
import { backendSanityClient } from '../lib/sanity/sanity.js';
import { extractTextFromDocxBuffer } from '../lib/docxText.js';
import { parseQuestions } from '../lib/questionParser.js';

export async function handleExtractQuestionsPreview(
  req: Request,
  res: Response
) {
  const { testId } = req.body;

  if (!testId || typeof testId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Missing or invalid testId.',
    });
  }

  try {
    console.log('[Extract Questions] Received testId:', testId);

    /*
     * Sanity Studio can work with draft documents.
     * If the Studio sends drafts.xxx, keep the original ID as well
     * and also try the published ID.
     */
    const publishedId = testId.startsWith('drafts.')
      ? testId.replace(/^drafts\./, '')
      : testId;

    console.log('[Extract Questions] Published ID:', publishedId);

    /*
     * First try the exact ID.
     */
    let testDoc = await backendSanityClient.fetch(
      `*[_type == "test" && _id == $testId][0]{
        _id,
        title,
        "wordFileUrl": questionWordUpload.asset->url
      }`,
      { testId }
    );

    /*
     * If exact ID is not found, try the published ID.
     */
    if (!testDoc && publishedId !== testId) {
      testDoc = await backendSanityClient.fetch(
        `*[_type == "test" && _id == $testId][0]{
          _id,
          title,
          "wordFileUrl": questionWordUpload.asset->url
        }`,
        { testId: publishedId }
      );
    }

    /*
     * Final fallback:
     * If we received a normal ID, also check the draft document.
     */
    if (!testDoc && !testId.startsWith('drafts.')) {
      testDoc = await backendSanityClient.fetch(
        `*[_type == "test" && _id == $draftId][0]{
          _id,
          title,
          "wordFileUrl": questionWordUpload.asset->url
        }`,
        { draftId: `drafts.${testId}` }
      );
    }

    if (!testDoc) {
      console.warn(
        '[Extract Questions] Test document not found.',
        {
          receivedTestId: testId,
          publishedId,
        }
      );

      return res.status(404).json({
        success: false,
        error:
          'Test document not found. Make sure the Test Series document is saved and the correct Sanity document ID is being sent.',
        testId,
      });
    }

    console.log(
      '[Extract Questions] Test found:',
      testDoc._id,
      testDoc.title
    );

    if (!testDoc.wordFileUrl) {
      return res.status(400).json({
        success: false,
        error:
          'No Word file uploaded on this test yet. Upload a .docx file in "Question Word File", then save the Test document before extracting.',
      });
    }

    console.log(
      '[Extract Questions] Downloading Word file:',
      testDoc.wordFileUrl
    );

    const fileResponse = await fetch(testDoc.wordFileUrl);

    if (!fileResponse.ok) {
      console.warn(
        '[Extract Questions] Word file download failed:',
        fileResponse.status,
        fileResponse.statusText
      );

      return res.status(502).json({
        success: false,
        error:
          'Could not download the Word file from Sanity.',
      });
    }

    const arrayBuffer = await fileResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(
      '[Extract Questions] Word file downloaded:',
      buffer.length,
      'bytes'
    );

    const text = await extractTextFromDocxBuffer(buffer);

    console.log(
      '[Extract Questions] Extracted text length:',
      text.length
    );

    const { questions, warnings } = parseQuestions(text);

    console.log(
      '[Extract Questions] Parsed questions:',
      questions.length
    );

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
      testId: testDoc._id,
      testTitle: testDoc.title,
      questions,
      warnings,
    });
  } catch (err: unknown) {
    console.error(
      '[Extract Questions] Error:',
      err
    );

    return res.status(500).json({
      success: false,
      error:
        'Failed to process the Word file. Please try again.',
    });
  }
}