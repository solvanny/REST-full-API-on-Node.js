const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config')
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
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
  },
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
  let token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
}

const User = mongoose.model('users', userSchema);

function validateUser(user) {
  let userSchema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().required()
  }
  return Joi.validate(user, userSchema);
}

module.exports.User = User;
module.exports.validation = validateUser;