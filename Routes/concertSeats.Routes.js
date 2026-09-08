const express =  require('express');
const concertSeats = require('../controllers/concertSeats.controller');
const optionalAuth = require('../middleware/optional.middleware')
const  concertRouter = express.Router();

concertRouter.get('/api/ConcertSeats/status',optionalAuth,concertSeats);

module.exports = concertRouter;
