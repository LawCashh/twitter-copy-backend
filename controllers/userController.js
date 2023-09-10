const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.verifyJWT = catchAsync(async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) return next(new Error('no token, please provide one'));
  token = token.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Unauthorized: Invalid token'));
    }
    req.user = decoded;
    next();
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  res.status(200).json({ message: 'uzeti svi korisnici' });
});

exports.createNewUser = catchAsync(async (req, res, next) => {
  const password = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({
    name: req.body.name,
    password,
    email: req.body.email,
    username: req.body.username,
  });
  const newUserDoc = await newUser.save().catch((err) => {
    let statusCode = 409;
    if (err.code == '11000') statusCode = 409;
    res.status(statusCode).json({ status: 'not ok', message: err.message });
  });
  if (newUserDoc)
    res.status(201).json({
      status: 'ok',
      message: 'kreiran novi user',
      data: newUserDoc.toJSON,
    });
});

exports.editUser = catchAsync(async (req, res, next) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  const updatedUserData = {
    name: req.body.name,
    username: req.body.username,
  };
  const updatedUser = await User.findByIdAndUpdate(id, updatedUserData, {
    new: true,
    runValidators: true,
  });
  if (!updatedUser)
    res.status(404).json({ status: 'not ok', message: 'user not found' });
  res.status(200).json({ status: 'ok', message: 'user edited' });
});

exports.login = catchAsync(async (req, res, next) => {
  const userData = {
    username: req.body.username,
    password: req.body.password,
  };
  if (!userData.username || !userData.password) {
    res.status(400).json({ message: 'username or password missing' });
  }
  const user = await User.findOne({
    username: userData.username,
  }).select('+password');
  if (!user)
    res.status(404).json({ status: 'not ok', message: 'user not found' });
  const passwordCorrect = await bcrypt.compare(
    userData.password,
    user.password
  );
  if (passwordCorrect) {
    const token = jwt.sign(userData, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res
      .status(200)
      .json({ status: 'ok', message: 'uspjesan login', token: token });
  } else res.status(401).json({ status: 'not ok', message: 'pogresna sifra' });
});
