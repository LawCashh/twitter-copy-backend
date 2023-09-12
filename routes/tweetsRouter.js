const express = require('express');
const tweetsController = require('../controllers/tweetController');
const authController = require('../controllers/authController');

const tweetsRouter = express.Router();

tweetsRouter.get('/', tweetsController.getTweets);
tweetsRouter.post('/', authController.verifyJWT, tweetsController.createTweet);

module.exports = tweetsRouter;
