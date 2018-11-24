const config = require('config');
const debug = require('debug')('app:startup');
const express = require('express');
const app = express();

const mongoose = require('mongoose');

if(!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

mongoose.connect('mongodb://localhost/vidlydb', { useNewUrlParser: true } )
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.log('Could not connect to Mango DB...', err))

const movies = require('./routes/movies');
const customers = require('./routes/customers');
const genres = require('./routes/genres');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth')

const helmet = require('helmet');
const morgan = require('morgan');
const pug = require('pug');
const logger = require('./logger');
const authentication = require('./authentication');

app.set('view engine', 'pug');
app.set('views', './views'); //default
app.use(express.json());
app.use(helmet());
app.use(morgan('tiny'));
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

console.log(`Aplication Name ${config.get('name')}`);
console.log(`Mail Server ${config.get('mail.host')}`);
console.log(`Mail password ${config.get('mail.password')}`);

// app.get('/api/customers', (req, res) => {
//   res.render('index', {title: 'My Express App', message: 'Hello World!'})
// });

//Debuging 
if(app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan enabled...')
}

var port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listning port ${port} ...`));