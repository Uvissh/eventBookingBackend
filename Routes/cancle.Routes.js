const express = require('express');
const cancelController = require('../controllers/cancelBooking.controller');
const cancelRouter = express.Router();


cancelRouter.delete('/api/bookings/:booking_id',cancelController);

module.exports  = cancelRouter;