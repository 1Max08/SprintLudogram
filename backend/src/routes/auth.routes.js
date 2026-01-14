import { Router } from 'express';
import { signup, login, logout, dashboard } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.get('/dashboard', authMiddleware, dashboard);

export default router;
