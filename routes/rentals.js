const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');
const { Rental } = require('../modules/rental');
const { Customers } = require('../modules/customer');
const { Movies } = require('../modules/movie');

Fawn.init(mongoose);

//Find all rentals
router.get('/', async (req, res) => {
  let rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

//Find rentals by ID
router.get('/:id', async (req, res) => {
  let rentals = await Rental.findById(req.body.id);
  res.send(rentals);
});

//Create a new rental
router.post('/', async (req, res) => {
  let customer = await Customers.findById(req.body.customerId);
  if(!customer) return res.status(404).send('This customer does not exists...')

  let movie = await Movies.findById(req.body.movieId);
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
    }
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
router.put('/:id', async (req, res) => {
  let customer = await Customers.findById(req.body.customerId);
  let movie = await Movies.findById(req.body.movieId);

  let rental = await Rental.findByIdAndUpdate(req.params.id, {
    customer: {
      id: customer._id,
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
    rentalsPerDay: req.body.rentalsPerDay
  });
  rental = await rental.save();
  res.send(rental);
});

//Delete rental
router.delete('/:id', async (req, res) => {
  let rental = await Rental.deliteOne({_id: req.marams.id})
  res.send(rental);
});

module.exports = router;