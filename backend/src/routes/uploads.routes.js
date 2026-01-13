import { Router } from 'express';
import { uploadImage } from '../middlewares/upload.middleware.js';
import { uploadImage as uploadController } from '../controllers/uploads.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post(
  '/',
  authMiddleware,
  uploadImage.single('image'),
  uploadController
);

export default router;
