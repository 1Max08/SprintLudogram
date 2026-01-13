import Game from '../models/game.model.js';

export const getAllGames = async (req, res, next) => {
  try {
    const games = await Game.find()
      .populate('ownerId', 'email avatarUrl')
      .sort({ createdAt: -1 });

    res.json(games);
  } catch (err) {
    next(err);
  }
};

export const getGameById = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate('ownerId', 'email avatarUrl');

    if (!game) return res.status(404).json({ message: 'Jeu introuvable' });

    res.json(game);
  } catch (err) {
    next(err);
  }
};

export const createGame = async (req, res, next) => {
  try {
    const game = await Game.create({
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      ownerId: req.user.id,
    });

    res.status(201).json(game);
  } catch (err) {
    next(err);
  }
};

export const updateGame = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Jeu introuvable' });

    if (game.ownerId.toString() !== req.user.id)
      return res.status(403).json({ message: 'Accès interdit' });

    game.title = req.body.title ?? game.title;
    game.description = req.body.description ?? game.description;
    if (req.file) game.imageUrl = `/uploads/${req.file.filename}`;

    await game.save();
    res.json(game);
  } catch (err) {
    next(err);
  }
};

export const deleteGame = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Jeu introuvable' });

    if (game.ownerId.toString() !== req.user.id)
      return res.status(403).json({ message: 'Accès interdit' });

    await game.deleteOne();
    res.json({ message: 'Jeu supprimé' });
  } catch (err) {
    next(err);
  }
};

export const toggleLike = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Jeu introuvable' });

    const userId = req.user.id;
    const index = game.likes.findIndex(id => id.toString() === userId);

    if (index === -1) game.likes.push(userId);
    else game.likes.splice(index, 1);

    await game.save();
    res.json(game.likes);
  } catch (err) {
    next(err);
  }
};
