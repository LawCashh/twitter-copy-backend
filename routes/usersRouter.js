const express = require('express');
const userController = require('../controllers/userController');

const usersRouter = express.Router();

usersRouter.get('/', userController.getAllUsers);

module.exports = usersRouter;
