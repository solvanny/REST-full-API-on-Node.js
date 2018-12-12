const request = require('supertest');
const server = require('../../index');
const { Rental } = require('../../models/rental');
const mongoose = require('mongoose');


describe('/api/returns', () => {
  let customerId;
  let movieId;
  let rental;


  beforeEach( async () => { 
    server; 
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
   });

  afterEach( async () => { 
    await server.close();
    await Rental.remove({});
  });

  it('It should return 401 if client is in not logged in.', async () => {
    let res = await request(server)
      .post('/api/returns')
      .send({ customerId, movieId })

      expect(res.status).toBe(401);
  });
});