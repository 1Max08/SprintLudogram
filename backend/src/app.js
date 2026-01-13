import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import authRoutes from './routes/auth.routes.js';
import gameRoutes from './routes/games.routes.js';
import listRoutes from './routes/lists.routes.js';
import uploadRoutes from './routes/uploads.routes.js';
import { errorMiddleware, notFoundMiddleware } from './middlewares/error.middleware.js';

const app = express();

// Middlewares globaux
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Exposer les images uploadées
app.use('/uploads', express.static(path.resolve('src/uploads')));

// Route racine pour test
app.get('/', (req, res) => {
  res.json({ message: 'TEST' });
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/uploads', uploadRoutes);

// 404 + gestion globale des erreurs
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
