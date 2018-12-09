const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/db')();
require('./startup/routes')(app);
require('./startup/logging')();
require('./startup/config')();
require('./startup/debug')(app);
require('./startup/validation')();

const port = process.env.PORT;
const server = app.listen(port, () => console.log(`Listning port ${port} ...`));

//not a recomandation solution only for a development testing
server.timeout = 0;

module.exports = server;