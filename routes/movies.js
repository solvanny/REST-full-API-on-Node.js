const express = require('express');
const router = express.Router();
const { Movies, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const mongoose = require('mongoose');


// return all object
router.get('/', async (req, res) => {
  let movies = await Movies.find().sort('title');
  res.send(movies);

});

//return object's property
router.get('/:id', async (req, res) => {
  let movie = await Movies.findById(req.params.id)
  if(!movie) return res.status(404).send('This movie does not exist!');
  res.send(movie);
});


//create a new property of object
router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  let movie = new Movies({ 
    title: req.body.title,
    year: req.body.year,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    isPublished: req.body.isPublished,
    publishingDate: new Date()
  });
  
  movie = await movie.save();
  
  res.send(movie);
});

//Update a property of object
router.put('/:id', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  const movie = await Movie.findByIdAndUpdate(req.params.id,
    { 
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    }, { new: true });

  if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  
  res.send(movie);
});


router.delete('/:id', async (req, res) => {
  let movie = await Movies.deleteOne({_id: req.params.id});

  if(!movie) return res.status(404).send('This movie does not exist!');
  res.send(movie);
});



module.exports = router;