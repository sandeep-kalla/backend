import express from 'express';
import { signupUser, loginUser, checkSession, logoutUser } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/signup', signupUser);
router.get('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/session', checkSession);

export default router;