const mongoose = require('mongoose');

const catchAsync = require('../utils/catchAsync');
const Tweet = require('../models/tweetModel');

exports.getTweets = catchAsync(async (req, res) => {
  const page = req.query.page;
  if (!page) page = 1;
  const tweetQuery = await Tweet.find()
    .skip((page - 1) * 10)
    .limit(10)
    .sort('-createdOn');
  if (tweetQuery.length == 0)
    return res
      .status(400)
      .json({ status: 'not ok', message: 'ne postoji ta stranica' });
  res
    .status(200)
    .json({ status: 'ok', message: 'uzeti tweetovi', data: tweetQuery });
});

exports.getNumberOfTweets = catchAsync(async (req, res) => {
  const numOfTweets = await Tweet.estimatedDocumentCount();
  if (!numOfTweets)
    return res
      .status(400)
      .json({ status: 'not ok', message: 'nije uzet broj dokumenata' });
  res
    .status(200)
    .json({ status: 'ok', message: 'uzet broj dokumenata', data: numOfTweets });
});

exports.createTweet = catchAsync(async (req, res) => {
  const tweet = new Tweet({
    content: req.body.content,
    userId: req.user.id,
    createdOn: new Date().toISOString(),
  });
  savedTweet = await tweet.save();
  if (!savedTweet)
    res.status(400).json({ status: 'not ok', message: 'nije kreiran tweet' });
  res
    .status(201)
    .json({ status: 'ok', message: 'kreiran tweet', data: savedTweet });
});

exports.getTweetById = catchAsync(async (req, res) => {
  const tweet = await Tweet.find({
    _id: new mongoose.Types.ObjectId(req.params.id),
  });
  if (tweet.length == 0)
    return res
      .status(404)
      .json({ status: 'not ok', message: 'nije nadjen tweet' });
  res.status(200).json({ status: 'ok', message: 'nadjen tweet', data: tweet });
});
