const mongoose = require('mongoose');

const catchAsync = require('../utils/catchAsync');
const Tweet = require('../models/tweetModel');

exports.getTweets = catchAsync(async (req, res) => {
  //   const page = req.query.page;
  //   if(!page)
  //   res.status(200).json({ status: 'ok', numberOfPages: 10,  });
});

exports.createTweet = catchAsync(async (req, res) => {
  //TODO: sad radi kreiranje tweetova, nastavi dalje, paginacija za get tweets
  const tweet = new Tweet({
    content: req.body.content,
    userId: req.user.id,
  });
  savedTweet = await tweet.save();
  if (!savedTweet)
    res.status(400).json({ status: 'not ok', message: 'nije kreiran tweet' });
  res
    .status(201)
    .json({ status: 'ok', message: 'kreiran tweet', data: savedTweet });
});
