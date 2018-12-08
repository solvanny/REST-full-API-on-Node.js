const { User } = require('../../../models/user');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');
const server = require('../../../index');
const { Genre } = require('../../../models/genre');

describe('auth middleware', () => {
  beforeEach(() => { server });
  afterEach( async () => { 
    server.close(); 
    await Genre.deleteOne({});
  });
  it('should populate req.user with the payload of a valid JWT', () => {
    const user = { 
      _id: mongoose.Types.ObjectId().toHexString(), 
      isAdmin: true 
    };
    let token = new User(user).generateAuthToken();
    let req = {
      header: jest.fn().mockReturnValue(token)
    };
    let res = {};
    let next = jest.fn();

    auth(req, res, next);

    expect(req.user).toMatchObject(user);
  });
})