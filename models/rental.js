const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');
const { customerSchema } = require('./customer');
const { movieSchema } = require('./movie');

const rentalSchema = new mongoose.Schema({
  customer: {
    type: customerSchema,
    required: false
  },
  movie: {
    type: movieSchema,
    required: false
  },
  rentalsPerDay: {
    type: Number,
    min: 0,
    max: 255
  },
  dateOut: {
    type: Date,
    require: true,
    dateDefault: Date.now
  },
  dateReturned: {
    type: Date,
    require: true
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});

function validationRental(rental) {
  let schema = {
    customerId: Joi.string().required(),
    movieId: Joi.string().required()
  }
  return Joi.validate(rental, schema);
};

const Rental = mongoose.model('Rentals', rentalSchema);

module.exports.Rental = Rental;
