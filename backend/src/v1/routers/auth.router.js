const express = require('express');

const { signupController,signinController } = require('../../controllers/auth.controller');
const { validationMiddleware } = require('../../middleware/validation.middleware')

const authRouter = express.Router();

// Signup route - only needs validation middleware
authRouter.post('/signup', validationMiddleware('signup'), signupController);

// Signin route - only needs validation middleware
authRouter.post('/signin', validationMiddleware('signin'), signinController);

module.exports = authRouter;