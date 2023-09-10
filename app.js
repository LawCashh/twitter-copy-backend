const express = require('express');

const usersRouter = require('./routes/usersRouter');

const app = express();

app.use(express.json());
app.use('/users', usersRouter);

app.use((err, req, res, next) => {
  res.status(401).json({ message: err.message });
});

module.exports = app;
