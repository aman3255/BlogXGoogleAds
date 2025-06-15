const express = require('express');

const { adminController , adminLoginController} = require('../../controllers/admin.controller');

const adminRouter = express.Router();

adminRouter.get('/create', adminController);
adminRouter.post('/login', adminLoginController);


module.exports = adminRouter;