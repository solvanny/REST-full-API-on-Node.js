const moment = require('moment');
const request = require('supertest');
const { Movies } = require('../../models/movie');
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const mongoose = require('mongoose');


describe('/api/returns', () => {
  let customerId;
  let movieId;
  let rental;
  let token;
  let server;
  let movie;
  
  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({movieId, customerId})
  }

  beforeEach( async () => { 
    server = require('../../index'); 
    token = new User().generateAuthToken();
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    
    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345678910',
        isGold: true,
        address: 'Toronto, Canada'
      },
      movie: {
        _id: movieId,
        title: '123456',
        dailyRentalRate: 2
      }
    });
    await rental.save();

    movie = new Movies({
      _id: movieId,
      title: '123546',
      genre: {name: '123456'},
      dailyRentalRate: 2,
      numberInStock: 10
    });
    await movie.save();
  });

  afterEach( async () => { 
    await server.close();
    await Rental.remove({});
    await Movies.remove({});
  });

  it('It should return 401 if client is in not logged in.', async () => {
    token = '';
    let res = await exec();
    expect(res.status).toBe(401);
  });

  it('Return 400 if customerId is not provided', async () => {
    customerId = '';

    let res = await exec();

    expect(res.status).toBe(400);
  });

  it('Return 400 if movieId is not provided', async () => {
    movieId = '';
    let res = await exec();
    expect(res.status).toBe(400);
  });

  it('Return 404 if no rental found for this customer/movie', async () => {
    await  Rental.remove({});
    
    let res = await exec();
    expect(res.status).toBe(404);
  });

  it('Return 400 if rental return already processed', async () => {
    rental.dateReturned = new Date();
    await rental.save();
    let res = await exec();
    expect(res.status).toBe(400);
  });

  it('Return 200 if valid request', async () => {
    
    let res = await exec();
    expect(res.status).toBe(200);
  });
 
  it('Set the information', async () => {
    
    let res = await exec();
    expect(res.status).toBe(200);
  });

  it('Should set the returnDate if imput is valid', async () => {
    
    await exec();

    let rentalInDb = await Rental.findById(rental._id);
    let diff = new Date() - rentalInDb.dateReturned;
    expect(diff).toBeLessThan(10 * 1000);
  });

  it('Should the rental fee imput is valid', async () => {
    rental.dateOut = moment().add(-7, 'days').toDate();
    await rental.save();
    await exec();
    let rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(14);
  });

  it('The stock should incresed', async () => {
    await exec();
    let movieInDb = await Movies.findById(movieId);
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });

  it('should return the rental if input is valid', async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining(['dateReturned', 'rentalFee',
      'customer', 'movie']));
  });
});