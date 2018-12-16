const moment = require('moment');
const express = require('express');
const router = express.Router();
const { Rental } = require('../models/rental');
const { Movies } = require('../models/movie');
const auth = require('../middleware/auth');

router.post('/', auth,  async (req, res) => {

  if(!req.body.customerId) return res.status(400).send('CustomerId is not provided');
  if(!req.body.movieId) return res.status(400).send('MovieId is not provided');
  
  let rental = await Rental.findOne({
    'customer._id' : req.body.customerId,
    'movie._id': req.body.movieId
  });

  if(!rental) return res.status(404).send('rental not found');

  if(rental.dateReturned) return res.status(400).send('Return already processed');

  rental.dateReturned = new Date();
  let rentalDays = moment().diff(rental.dateOut, 'days');
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
  await rental.save();

  await Movies.update({_id: rental.movie._id},{
    $inc: { numberInStock: 1 }
  });
  
  return res.send(rental);
});

module.exports = router;  