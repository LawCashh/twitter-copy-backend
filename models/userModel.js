const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The name can't be empty"],
  },
  username: {
    unique: true,
    type: String,
    minLength: 5,
    required: [true, "Username can't be empty"],
  },
  email: {
    unique: true,
    type: String,
    required: [true, "Email can't be empty"],
    validate: [validator.isEmail, 'Email not valid'],
  },
  password: {
    select: false,
    type: String,
    minLength: 8,
    required: [true, "The password can't be empty"],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
