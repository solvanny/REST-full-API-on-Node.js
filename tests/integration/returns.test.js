const server = require('../../index');
const { Rental } = require('../../models/rental');
const mongoose = require('mongoose');

describe('/api/returns', () => {
  let customerId;
  let movieId;
  var rental;

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
    server.close();
    await Rental.remove({});
  });

  it('It should work', async () => {
    let result = await Rental.findById(rental._id);
    expect(result).not.toBeNull();
  });
});