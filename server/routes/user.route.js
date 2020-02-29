const express = require('express');

const asyncMiddleware = require('../middlewares/async.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const userRouter = express.Router();

userRouter.get(
  '/profile',
  authMiddleware,
  asyncMiddleware((req, res, next) => {
    res.status(200).send(req.userInstance);
  }),
);

module.exports = userRouter;
