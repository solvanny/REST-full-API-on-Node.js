const bcrypt = require('bcrypt');
const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { User} = require('../models/user');
const Joi = require('joi');


//Get all users
router.get('/', async (req, res) => {
  let users = await User.find().sort('name');
  res.send(users);
});

//Create a new user
router.post('/', async (req, res) => {
  let { error } = validation(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if(!user) res.status(400).send('Invalid email or password.');
  
  let validPassword = await bcrypt.compare(req.body.password, user.password);
  if(!validPassword) return res.status(400).send('Invalid email or password.');

  let token = user.generateAuthToken();
  res.send(token );
});

//Delete user by ID
router.delete('/:id', async (req, res) => {
  let user = await User.findByIdAndRemove(req.params.id);
  if (!user) return res.status(404).send('The user with the given ID was not found.');
  res.send(user);
});

//Find user by ID
router.get('/:id', async (req, res) => {
  let user = await User.findById(req.params.id);
  if (!user) return res.status(404).send('The user with the given ID was not found.');
  res.send(user);
});


function validation(req) {
  let schema = {
    email: Joi.string().min(5).max(50).email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().min(5).max(255).regex(/^[a-zA-Z0-9]{3,30}$/).required()
  }
  return Joi.validate(req, schema)
}
module.exports = router;