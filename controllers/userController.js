const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  res.status(200).json({ message: 'uzeti svi korisnici' });
});
