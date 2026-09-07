const express = require('express');
const concertBooking = require('../controllers/concertBooking.controllers');
const  concertBookingRouter = express.Router();

concertBookingRouter.post('/api/concertbooking',concertBooking);

module.exports = concertBookingRouter;