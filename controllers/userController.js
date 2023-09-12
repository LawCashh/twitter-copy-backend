const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const promisify = require('promisify');
const { signTokenAndStoreInCookie, clearJWT } = require('./authController');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  users = await User.find();
  res.status(200).json({ message: 'uzeti svi korisnici', data: users });
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
    return res
      .status(statusCode)
      .json({ status: 'not ok', message: err.message });
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
    return res
      .status(404)
      .json({ status: 'not ok', message: 'user not found' });
  res.status(200).json({ status: 'ok', message: 'user edited' });
});

exports.login = catchAsync(async (req, res, next) => {
  const userData = {
    username: req.body.username,
  };
  if (!userData.username || !req.body.password) {
    return res.status(400).json({ message: 'username or password missing' });
  }
  const user = await User.findOne({
    username: userData.username,
  }).select('+password');
  if (!user)
    return res
      .status(404)
      .json({ status: 'not ok', message: 'user not found' });
  const passwordCorrect = await bcrypt.compare(
    req.body.password,
    user.password
  );
  userData.role = user.role;
  userData.id = user._id;
  if (passwordCorrect) {
    const token = signTokenAndStoreInCookie(userData, req, res);
    res
      .status(200)
      .json({ status: 'ok', message: 'uspjesan login', token: token });
  } else res.status(401).json({ status: 'not ok', message: 'pogresna sifra' });
});

exports.giveAdmin = catchAsync(async (req, res, next) => {
  const data = {
    username: req.body.username,
  };
  if (!data.username)
    throw new Error({ message: 'ne postoji korisnik sa tim emailom' });
  const user = await User.findOneAndUpdate(
    {
      username: data.username,
    },
    { role: 'admin' },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: 'ok',
    message: 'uspjesno dodijeljenje admin permisije',
    data: user,
  });
});

exports.deleteUserSelf = catchAsync(async (req, res) => {
  if (!req.user.username)
    throw new Error("error, you can't delete another person");
  const user = await User.findOneAndDelete({
    username: req.user.username,
  });
  res.clearCookie('jwt');
  res
    .status(200)
    .json({ status: 'ok', message: 'uspjesno obrisan korisnik', data: user });
});

exports.deleteUser = catchAsync(async (req, res) => {
  let id = new mongoose.Types.ObjectId(req.params.id);
  let user = await User.findById(id);
  if (!user) res.status(400).json({ message: "user doesn't exit" });
  if (
    (user.role == 'admin' || user.role == 'owner') &&
    req.user.role == 'admin'
  )
    return res
      .status(401)
      .json({ status: 'not ok', message: 'not authorized' });
  user = await user.deleteOne();
  res.clearCookie('jwt');
  res
    .status(200)
    .json({ status: 'ok', message: 'uspjesno obrisan korisnik', data: user });
});
