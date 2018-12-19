const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function() {
  let db = config.get('db');
  let options = {useNewUrlParser: true}

  mongoose.connect(db, options)
    .then(() => console.log(`Connected to ${db}...`))
}
