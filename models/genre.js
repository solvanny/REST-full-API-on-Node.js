const Joi = require('joi');
const mongoose = require('mongoose');


const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const Genre = mongoose.model('Genres', genreSchema);





function validateGenre(genre) {

  let schema = {    
    name: Joi.string().min(4).max(250).required(),
  };
  return Joi.validate(genre, schema);
}

module.exports.Genre = Genre;
module.exports.validate = validateGenre;
module.exports.genreSchema = genreSchema;