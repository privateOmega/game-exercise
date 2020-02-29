require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const asyncMiddleware = require('./utils/async-middleware');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get(
  '/status',
  asyncMiddleware((req, res, next) => {
    res.status(200);
    res.json({ status: 'ok' });
  }),
);

// catch all other routes
app.use(
  asyncMiddleware((req, res, next) => {
    res.status(404);
    res.json({ message: '404 - Page Not Found' });
  }),
);

// handle errors
app.use(
  asyncMiddleware((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err });
  }),
);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});
