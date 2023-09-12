const express = require('express');
const tweetsController = require('../controllers/tweetController');
const authController = require('../controllers/authController');

const tweetsRouter = express.Router();

tweetsRouter.get('/', tweetsController.getTweets);
tweetsRouter.get(
  '/num-of-tweets',
  authController.verifyJWT,
  authController.restrictTo('owner', 'admin'),
  tweetsController.getNumberOfTweets
);
tweetsRouter.get(
  '/:id',
  authController.verifyJWT,
  tweetsController.getTweetById
);
tweetsRouter.post('/', authController.verifyJWT, tweetsController.createTweet);

module.exports = tweetsRouter;
