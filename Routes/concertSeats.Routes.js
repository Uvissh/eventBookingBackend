const express =  require('express');
const concertSeats = require('../controllers/concertSeats.controller');
const  concertRouter = express.Router();

concertRouter.get('/api/ConcertSeats/status',concertSeats);

module.exports = concertRouter;
