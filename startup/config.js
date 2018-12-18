const winston = require('winston')
const config = require('config');

module.exports = function () {

  if(!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }

  if(!config.get('mail.host')) {
    throw new Error('FATAL ERROR: mail host is not defined.');
  }
  
  winston.info(`Aplication Name ${config.get('name')}`);
  winston.info(`Mail Server ${config.get('mail.host')}`);
  winston.info(`Mail password ${config.get('mail.password')}`);
};