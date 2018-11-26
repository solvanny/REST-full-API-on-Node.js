const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/db') ();
require('./startup/routes') (app);
require('./startup/logging')
require('./startup/config') ();
require('./startup/debug') (app);
require('./startup/validation') ();

var port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listning port ${port} ...`));