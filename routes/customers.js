const express = require('express');
const router = express.Router();
const middlValidate = require('../middleware/validate');
const { validate , Customers } = require('../models/customer');


//Create a new customer
router.post('/', middlValidate(validate), async (req, res) => {

  let newCustomer = new Customers({
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    isGold: req.body.isGold
  });
  newCustomer = await newCustomer.save();
  res.send(newCustomer);
});

//Return all customers
router.get('/', async (req, res) => {
  let customers = await Customers.find().sort('name');
  res.send(customers);
});

//Return customer by ID
router.get('/:id', async (req, res) => {
  let customer = await Customers.findOne({_id: req.params.id});
  if(!customer) return res.status(404).send('Customer with this ID does not exist...');
  res.send(customer);
});

//Update customer by ID
router.put('/:id', middlValidate(validate), async (req, res) => {

  let customer = await Customers.findOneAndUpdate( req.params.id, { 
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone,
    isGold: req.body.isGold
  }, {new: true} 
);

  if(!customer) return res.status(404).send('Customer with this ID does not exist...');
  res.send(customer);
});

//Remove customer by ID
router.delete('/:id', async (req, res) => {
  console.log(req.params.id)
  let customer = await Customers.findOneAndDelete({_id: req.params.id});
  if(!customer) return res.status(404).send('Customer with this ID does not exist...');
  res.send(customer);
});

module.exports = router;