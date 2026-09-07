const express = require('express');
const  refresh = require('../controllers/refresh.controllers')

const refreshRouter = express.Router();

refreshRouter.post('/api/auth/refresh',refresh);

module.exports = refreshRouter;