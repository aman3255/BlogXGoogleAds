const express = require('express');

const { adminController } = require('../../controllers/admin.controller');

const adminRouter = express.Router();

adminRouter.get('/', adminController);

module.exports = adminRouter;