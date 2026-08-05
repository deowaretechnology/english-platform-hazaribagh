import { Router } from 'express';
import { handleSignup, handleLogin, handleGetUserProfile } from '../controllers/authController.js';

const router = Router();

router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.get('/user/:userId', handleGetUserProfile);

export default router;
