const Joi = require('joi');
const mongoose = require('mongoose');


const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

const Genre = mongoose.model('Genres', genreSchema);





function validateGenre(genre) {

  let schema = {    
    name: Joi.string().min(5).max(50).required(),
  };
  return Joi.validate(genre, schema);
}

module.exports.Genre = Genre;
module.exports.validate = validateGenre;
module.exports.genreSchema = genreSchema;