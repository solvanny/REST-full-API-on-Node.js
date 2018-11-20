const mongoose = require('mongoose');
const Joi = require('joi');



const User = mongoose.model('users', new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 50,
    required: true
  },
  email: {
    type: String,
    minlength: 2,
    maxlength: 255,
    required: true,
    unique:true
  },
  password: {
    type: String,
    minlength: 2,
    maxlength: 255,
    required: true
  }
}));

function validateUser(user) {
  let userSchema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
  }
  return Joi.validate(user, userSchema);
}

module.exports.User = User;
module.exports.validation = validateUser;