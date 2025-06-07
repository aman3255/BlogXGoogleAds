const express = require('express');

const { signupController,signinController } = require('../../controllers/auth.controller');
const { authMiddleware } = require('../../middleware/auth.middleware')

const authRouter = express.Router();

authRouter.post('/signup', signupController);
authRouter.post('/signin', authMiddleware, signinController);

module.exports = authRouter;