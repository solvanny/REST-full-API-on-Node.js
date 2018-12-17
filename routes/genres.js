const validateObjectId = require('../middleware/validateObjectId');
const express = require('express');
const router = express.Router();
const  middlValidate = require('../middleware/validate');
const { Genre, validate } = require('../models/genre');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');

//Get all genres
router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

//Create a new genre
router.post('/', [auth,  middlValidate(validate)], async (req, res) => {

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  
  res.send(genre);
});

//Update genre by ID
router.put('/:id', [auth,  middlValidate(validate)], async (req, res) => {

  const genre = await Genre.findOneAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
  res.send(genre);
});

//Delete genre by ID
router.delete('/:id', [auth, admin], async (req, res) => {
  const genre = await Genre.findOneAndDelete({_id: req.params.id});

  if (!genre) return res.status(401).send('The genre with the given ID was not found.');

  res.send(genre);
});

//Find genre by ID
router.get('/:id', validateObjectId, async (req, res) => {

  const genre = await Genre.findOne({_id: req.params.id});

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

module.exports = router;