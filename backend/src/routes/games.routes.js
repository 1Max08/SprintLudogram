import { Router } from 'express';
import { getAllGames, getGameById, createGame, updateGame, deleteGame,toggleLike } from '../controllers/games.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { uploadImage } from '../middlewares/upload.middleware.js';

const router = Router();

// Public
router.get('/', getAllGames);
router.get('/:id', getGameById);

// Protected
router.post(
  '/',
  authMiddleware,
  uploadImage.single('image'),
  createGame
);

router.put(
  '/:id',
  authMiddleware,
  uploadImage.single('image'),
  updateGame
);

router.delete('/:id', authMiddleware, deleteGame);
router.post('/:id/like', authMiddleware, toggleLike);

export default router;
