const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

exports.verifyJWT = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) return next(new Error('no token, please provide one'));
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Unauthorized: Invalid token'));
    }
    req.user = decoded;
  });
  next();
});

exports.signTokenAndStoreInCookie = (userData, req, res) => {
  const token = jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarder-proto'] === 'https',
  });
  return token;
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return next(new Error('Unauthorized'));
    else next();
  };
};
