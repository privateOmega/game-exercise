const express = require('express');

const asyncMiddleware = require('../middlewares/async.middleware');
const userModel = require('../models/user.model');

const mainRouter = express.Router();

mainRouter.get(
  '/status',
  asyncMiddleware((req, res, next) => {
    res.status(200).json({ status: 'ok' });
  }),
);

mainRouter.post(
  '/register',
  asyncMiddleware(async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    const userCount = await userModel.countDocuments({
      email: email.toLowerCase(),
    });
    if (userCount > 0) {
      res.status(403).json({ message: 'forbidden' });
      return;
    }

    const userInstance = await userModel.create({
      firstName,
      lastName,
      email,
      password,
    });

    const token = userInstance.generateAuthToken();

    res.status(200).json({
      status: 'ok',
      user: {
        email: userInstance.email,
        name: userInstance.name,
        highScore: userInstance.highScore,
        token,
      },
    });
  }),
);

mainRouter.post(
  '/login',
  asyncMiddleware(async (req, res, next) => {
    const { email, password } = req.body;

    const userInstance = await userModel
      .findByCredentials(email.toLowerCase(), password)
      .catch(error => {
        res.status(401).json({ message: 'unauthenticated' });
      });
    if (!userInstance) {
      return;
    }

    const token = userInstance.generateAuthToken();

    res.status(200).json({
      status: 'ok',
      user: {
        email: userInstance.email,
        name: userInstance.name,
        highScore: userInstance.highScore,
        token,
      },
    });
  }),
);

module.exports = mainRouter;
