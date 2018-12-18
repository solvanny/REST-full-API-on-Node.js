const express = require('express');
const movies = require('../routes/movies');
const customers = require('../routes/customers');
const genres = require('../routes/genres');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth')
const pug = require('pug');
const logger = require('../logger');
const authentication = require('../authentication');
const error = require('../middleware/error');

const returns = require('../routes/returns');


module.exports = function(app) {
  app.set('view engine', 'pug');
  app.set('views', './views'); //default
  app.use(express.json());

  app.use(express.urlencoded({extended: true}));
  app.use(express.static('public'));
  app.use(logger);
  app.use(authentication);
  app.get(pug);
  app.use('/api/movies', movies);
  app.use('/api/customers', customers);
  app.use('/api/genres', genres);
  app.use('/api/rentals', rentals)
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/api/returns', returns)
  app.use(error);
}