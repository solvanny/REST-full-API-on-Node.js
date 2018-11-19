const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  id: Number,
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 50
  },
  address: {
    type: String,
    required: true
  },
  isGold: {
    type: Boolean,
    required: true
  }
});

const Customers = mongoose.model('Customers', customerSchema);


function validateCustomer(customer) {
  let schema = {
    name: Joi.string().required(),
    phone: Joi.number().required(),
    address: Joi.string().required(),
    isGold: Joi.boolean().required(),
    // publishingDate: Joi.required()
  }
  return Joi.validate(customer, schema);
};


module.exports.Customers = Customers;
module.exports.validate = validateCustomer;
module.exports.customerSchema = customerSchema;
