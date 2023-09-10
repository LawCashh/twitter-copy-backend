const express = require('express');
const userController = require('../controllers/userController');

const usersRouter = express.Router();

usersRouter.post('/', userController.createNewUser);
usersRouter.patch('/:id', userController.editUser);
usersRouter.post('/login', userController.login);

usersRouter.get('/', userController.verifyJWT, userController.getAllUsers);

module.exports = usersRouter;
