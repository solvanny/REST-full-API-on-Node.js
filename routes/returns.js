const express = require('express');
const Joi = require('joi');
const router = express.Router();
const { Rental } = require('../models/rental');
const { Movies } = require('../models/movie');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');



router.post('/', [auth, validate(validateReturn)],  async (req, res) => {

  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if(!rental) return res.status(404).send('rental not found');

  if(rental.dateReturned) return res.status(400).send('Return already processed');

  rental.return();
  await rental.save();

  await Movies.update({_id: rental.movie._id},{
    $inc: { numberInStock: 1 }
  });
  
  return res.send(rental);
});

function validateReturn(req) {
  let schema = {    
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };
  return Joi.validate(req, schema);
}

module.exports = router;  