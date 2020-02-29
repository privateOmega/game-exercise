require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const asyncMiddleware = require('./middlewares/async.middleware');
const mainRouter = require('./routes/main.route');

const { PORT, MONGO_CONNECTION_URL } = process.env;

mongoose.connect(MONGO_CONNECTION_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
});
mongoose.connection.on('error', error => {
  console.log('Unable to connect to mongo instance');
  console.error(error);
  process.exit(1);
});
mongoose.connection.on('connected', function() {
  console.log('Connected to mongo instance');
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', mainRouter);

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

app.listen(PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});

module.exports = app;
