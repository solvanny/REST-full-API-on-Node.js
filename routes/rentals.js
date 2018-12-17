const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');
const middlValidate = require('../middleware/validate');
const { Rental, validate } = require('../models/rental');
const { Customers } = require('../models/customer');
const { Movies } = require('../models/movie');

Fawn.init(mongoose);

//Find all rentals
router.get('/', async (req, res) => {
  let rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

//Find rentals by ID
router.get('/:id', middlValidate(validate), async (req, res) => {

  let rentals = await Rental.findOne(req.body.id);
  res.send(rentals);
});

//Create a new rental
router.post('/', middlValidate(validate), async (req, res) => {
 
  let customer = await Customers.findOne({_id: req.body.customerId});
  if(!customer) return res.status(404).send('This customer does not exists...')

  let movie = await Movies.findOne({_id: req.body.movieId});
  if(!movie) return res.status(404).send('This vonie does not exists...')

  if(movie.numberInStock === 0) return res.status(404).send('This movie doesn\'t in stock')

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      isGold: customer.isGold
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      genre: movie.genre,
      year: movie.year,
      dailyRentalRate: movie.dailyRentalRate
    },
    rentalsPerDay: rental.rentalsPerDay,
    dateOut: rental.dateOut,
    dateReturned: rental.dateReturned,
    rentalFee: rental.rentalFee
  });

  try{
    new Fawn.Task()
      .save('rentals', rental)
      .update('movies', {_id: movie._id}, {
        $inc: {  numberInStock: -1 }
      })
      .run();

    res.send(rental);
  }
  catch(ex) {
    res.status(500).send('Something failed.')
  }
});

//Update rental
router.put('/:id', middlValidate(validate), async (req, res) => {

  let customer = await Customers.findOne({_id: req.body.customerId});
  let movie = await Movies.findOne({_id: req.body.movieId});

  let rental = await Rental.findOneAndUpdate(req.params.id, {
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      isGold: customer.isGold
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      genre: movie.genre,
      year: movie.year
    },
    rentalsPerDay: req.body.rentalsPerDay,
    dateOut: rental.dateOut,
    dateReturned: rental.dateReturned,
    rentalFee: rental.rentalFee
  });
  rental = await rental.save();
  res.send(rental);
});

//Delete rental
router.delete('/:id', async (req, res) => {
  let rental = await Rental.findOneAndDelete({_id: req.params.id})
  res.send(rental);
});

module.exports = router;