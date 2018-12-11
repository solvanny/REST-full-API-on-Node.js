const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genre');


const date = new Date;

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  genre: {
    type: genreSchema,
  },
  year: {
    type: Number,
    min: 1979,
    max: date.getFullYear()
  },
  publishingDate: {
    type: Date,
    defaoult: Date.now()
  },
  isPublished: Boolean,
  numberInStock: {
    type: Number,
    require: true
  },
  dailyRentalRate: Number
});

const Movies = mongoose.model('Movies', movieSchema);


function validateMovie(movie) {
  let date = new Date();
  let year = date.getFullYear();

  let schema = {    
    title: Joi.string().min(4).required(),
    year: Joi.number().integer().min(1970).max(year).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().integer().min(0).required(),
    dailyRentalRate: Joi.number().integer().min(0).required(),
    isPublished: Joi.boolean().required(),
    // publishingDate: Joi.required() 
  };

  return Joi.validate(movie, schema);
}

module.exports.Movies = Movies;
module.exports.validate = validateMovie;
module.exports.movieSchema = movieSchema;