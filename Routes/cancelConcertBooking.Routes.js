const  express = require('express');
const cancelConcertBooking = require('../controllers/cancelConcert.controllers');
const   cancelConcertRouter = express.Router();


 cancelConcertRouter.delete('/api/concertbooking/:concertBookingId',cancelConcertBooking);

 module.exports = cancelConcertRouter;