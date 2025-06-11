const express = require('express');

const authRouter = require('./auth.router');
// const adminRouter = require('./admin.router');
const blogRouter = require('./blog.router');


const v1Router = express.Router();


v1Router.use('/auth', authRouter);
// v1Router.use('/admin', adminRouter);
v1Router.use('/blog', blogRouter);

module.exports = v1Router;