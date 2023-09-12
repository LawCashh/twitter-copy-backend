const express = require('express');
const cookieParser = require('cookie-parser');

const usersRouter = require('./routes/usersRouter');
const tweetsRouter = require('./routes/tweetsRouter');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/users', usersRouter);
app.use('/tweets', tweetsRouter);

app.use((err, req, res, next) => {
  res.status(401).json({ message: err.message });
});

module.exports = app;
