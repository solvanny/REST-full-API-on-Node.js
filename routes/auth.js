const bcrypt = require('bcrypt');
const express = require('express');
const _ = require('lodash');
const router = express.Router();
const validate = require('../middleware/validate');
const { User} = require('../models/user');
const Joi = require('joi');


//Get all users
router.get('/', async (req, res) => {
  let users = await User.find().sort('name');
  res.send(users);
});

//Create a new user
router.post('/', validate(validation), async (req, res) => {

  let user = await User.findOne({email: req.body.email});
  if(!user) res.status(400).send('Invalid email or password.');
  
  let validPassword = await bcrypt.compare(req.body.password, user.password);
  if(!validPassword) return res.status(400).send('Invalid email or password.');

  let token = user.generateAuthToken();
  res.send(token );
});

//Delete user by ID
router.delete('/:id', async (req, res) => {
  let user = await User.findOneAndDelete({_id: req.params.id});
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