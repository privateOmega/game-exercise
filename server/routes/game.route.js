const express = require('express');

const asyncMiddleware = require('../middlewares/async.middleware');
const gameModel = require('../models/game.model');

const gameRouter = express.Router();

gameRouter.get(
  '/start',
  asyncMiddleware(async (req, res, next) => {
    const { _id: userId } = req.userInstance;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const gamesCount = await gameModel.countDocuments({
      user: userId,
      createdAt: { $gte: today },
    });

    if (gamesCount >= 10) {
      res.status(403).json({ message: 'forbidden' });
      return;
    }

    const gameInstance = await gameModel.create({
      user: userId,
    });

    res.status(200).send(gameInstance);
  }),
);

gameRouter.post(
  '/:id/finish',
  asyncMiddleware(async (req, res, next) => {
    const { id } = req.params;
    const { score } = req.body;

    const gameInstance = await gameModel.findOneAndUpdate(
      { _id: id },
      { score: score || 0 },
      { new: true },
    );
    console.log(gameInstance);

    res.status(200).send(gameInstance);
  }),
);

module.exports = gameRouter;
