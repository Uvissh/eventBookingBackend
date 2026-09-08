const express = require('express');
const seat = require('../controllers/seat.controller')
const optionalAuth = require('../middleware/optional.middleware')

const seatrouter = express.Router();

seatrouter.get('/api/seats/status',optionalAuth,seat)

module.exports = seatrouter

