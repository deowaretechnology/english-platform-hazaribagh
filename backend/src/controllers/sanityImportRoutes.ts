import { Router } from 'express';
import { handleExtractQuestionsPreview } from '../controllers/sanityImportController.js';

const router = Router();

// POST /api/sanity/extract-questions-preview   { testId: string }
// Reads the test document's uploaded Word file, extracts + parses
// questions, and returns them for preview. Does NOT write to Sanity.
router.post('/extract-questions-preview', handleExtractQuestionsPreview);

export default router;