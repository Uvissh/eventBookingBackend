const express = require('express');
const booking = require('../controllers/booking.controller')

const bookingRouter = express.Router();


bookingRouter.post('/api/bookings',booking);

module.exports = bookingRouter;

