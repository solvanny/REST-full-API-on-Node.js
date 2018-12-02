const { User } = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
  it('Should return a valid JWT', () => {
    let payload = { 
      _id: new mongoose.Types.ObjectId().toHexString(),
       isAdmin: true 
    };
    let user = new User(payload);
    let token = user.generateAuthToken();
    let decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    expect(decoded).toMatchObject(payload);
  });
});