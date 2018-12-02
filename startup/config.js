// const winston = require('winston')
const config = require('config');

module.exports = function () {

  if(!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }
  
  console.log(`Aplication Name ${config.get('name')}`);
  console.log(`Mail Server ${config.get('mail.host')}`);
  console.log(`Mail password ${config.get('mail.password')}`);
};