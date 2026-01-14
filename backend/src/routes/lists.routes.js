import { Router } from 'express';
import {
  getMyLists,
  createList,
  addGameToList,
  removeGameFromList
} from '../controllers/lists.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getMyLists);
router.post('/', createList);
router.post('/:id/games', addGameToList);
router.delete('/:id/games', removeGameFromList);

export default router;
