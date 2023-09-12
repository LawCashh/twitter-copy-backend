const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const usersRouter = express.Router();

usersRouter.patch(
  '/give-admin',
  authController.verifyJWT,
  authController.restrictTo('owner'),
  userController.giveAdmin
);
usersRouter.post('/', userController.createNewUser);
usersRouter.get('/logout', (req, res, next) => {
  res.clearCookie('jwt');
  res.status(200).json({ status: 'ok', message: 'logged out' });
});
usersRouter.patch('/:id', authController.verifyJWT, userController.editUser);
usersRouter.post('/login', userController.login);
usersRouter.delete(
  '/',
  authController.verifyJWT,
  userController.deleteUserSelf
);
usersRouter.delete(
  '/:id',
  authController.verifyJWT,
  authController.restrictTo('owner', 'admin'),
  userController.deleteUser
);

usersRouter.get('/', authController.verifyJWT, userController.getAllUsers);

module.exports = usersRouter;
