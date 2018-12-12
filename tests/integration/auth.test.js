const server = require('../../index');
const { Genre } = require('../../models/genre');
const request = require('supertest');
const { User } = require('../../models/user');

describe('auth middlevare', () => {

  beforeEach(() => { server });
  afterEach( async () => { 
    await server.close(); 
    await Genre.deleteOne({});
  });

  let token;
  let name;

  const exec = () => {
    return request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({name});
  }
  
  beforeEach(() => {
    token = new User().generateAuthToken();
    name = 'genre1';
  });

  it('should return 401 no token is provided', async () => {
    token ='';
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it('should return 400 is invalid', async () => {
    token ='1234';
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it('should return 200 if token is valid', async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

});

