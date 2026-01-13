import List from '../models/list.model.js';

export const getMyLists = async (req, res, next) => {
  try {
    const lists = await List.find({ ownerId: req.user.id })
      .populate('gameIds');

    res.json(lists);
  } catch (err) {
    next(err);
  }
};

export const createList = async (req, res, next) => {
  try {
    const list = await List.create({
      name: req.body.name,
      ownerId: req.user.id,
    });

    res.status(201).json(list);
  } catch (err) {
    next(err);
  }
};

export const addGameToList = async (req, res, next) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ message: 'Liste introuvable' });

    if (list.ownerId.toString() !== req.user.id)
      return res.status(403).json({ message: 'Accès interdit' });

    if (!list.gameIds.includes(req.body.gameId))
      list.gameIds.push(req.body.gameId);

    await list.save();
    res.json(list);
  } catch (err) {
    next(err);
  }
};

export const removeGameFromList = async (req, res, next) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ message: 'Liste introuvable' });

    list.gameIds = list.gameIds.filter(
      id => id.toString() !== req.body.gameId
    );

    await list.save();
    res.json(list);
  } catch (err) {
    next(err);
  }
};
