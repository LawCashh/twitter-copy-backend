const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;
