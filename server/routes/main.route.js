const express = require('express');

const asyncMiddleware = require('../utils/async-middleware');

const mainRouter = express.Router();

mainRouter.get(
  '/status',
  asyncMiddleware((req, res, next) => {
    res.status(200);
    res.json({ status: 'ok' });
  }),
);

module.exports = mainRouter;
