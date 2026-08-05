import { Router } from 'express';
import { handleGetTestQuestions, handleEvaluateTest, handleCheckTestAttempt } from '../controllers/testController.js';

const router = Router();

router.get('/:slug/questions', handleGetTestQuestions);
router.get('/:slug/check-attempt/:userId', handleCheckTestAttempt);
router.post('/evaluate', handleEvaluateTest);

export default router;
