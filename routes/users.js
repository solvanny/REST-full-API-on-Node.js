const express = require('express');
const router = express.Router();
const { User, validation } = require('../modules/user');


//Get all users
router.get('/', async (req, res) => {
  const users = await User.find().sort('name');
  res.send(users);
});

//Create a new user
router.post('/', async (req, res) => {
  const { error } = validation(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = new User({ 
    name: req.body.name,
    password: req.body.password,
    email: req.body.email
   });
  user = await user.save();
  
  res.send(user);
});

//Update user by ID
router.put('/:id', async (req, res) => {
  const { error } = validation(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(req.params.id, { 
    name: req.body.name,
    password: req.body.password,
    email: req.body.email
  }, { new: true });

  if (!user) return res.status(404).send('The user with the given ID was not found.');
  
  res.send(user);
});

//Delete user by ID
router.delete('/:id', async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user) return res.status(404).send('The user with the given ID was not found.');

  res.send(user);
});

//Find user by ID
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).send('The user with the given ID was not found.');

  res.send(user);
});

module.exports = router;