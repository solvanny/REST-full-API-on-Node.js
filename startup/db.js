const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function() {
  let db = config.get('db');
  mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log(`Connected to ${db}...`))
}

 