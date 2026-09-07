const express = require('express');
const getProfile = require('../controllers/getProfile.controllers')

const profileRouter = express.Router();

profileRouter.get('/api/profile',getProfile);

module.exports = profileRouter;
