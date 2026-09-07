const express = require('express');
const seat = require('../controllers/seat.controller')

const seatrouter = express.Router();

seatrouter.get('/api/seats/status',seat)

module.exports = seatrouter

