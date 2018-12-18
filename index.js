const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/db')();
require('./startup/routes')(app);
require('./startup/logging')();
require('./startup/config')();
require('./startup/debug')(app);
require('./startup/validation')();
require('./startup/prod')(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.log('info', `Listning port ${port} ...`));

module.exports = server;