const request = require('supertest');
const server = require('../../index');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
const mongoose = require('mongoose');

describe('/api/genres',  () => {
 
  beforeEach(() => { server });
  afterEach( async () => { 
    server.close();
    await Genre.deleteOne({});
  });

  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.collection.insertMany([
        {name: 'genre1'},
        {name: 'genre2'}
      ]);

      let res = await request(server).get('/api/genres');
      
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
      expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it ('should return a single genre', async () => {
      let genre = new Genre({name: "genre1"});
      await genre.save();

      let res = await request(server).get('/api/genres/' + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', genre.name)
    });

    it ('should return error 404 if invalid id is passed ', async () => {
     
      let res = await request(server).get('/api/genres/1');

      expect(res.status).toBe(404);
    });

    it ('should return error 404 if no genre with given ID exists', async () => {
      let id = mongoose.Types.ObjectId();
      let res = await request(server).get('/api/genres/' + id);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    let token;
    let name;

    const exec = function() {
      return request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({name});
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = 'genre1';
    });
    
    it('should returh 401 if client is not logged in', async () => {
      token = '';
      let res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return 400 if genre less than 5 characters', async () => {
      name = '1234';
      let res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 400 if genre is more than 50 characters', async () => {
      name = new Array(52).join('a');
      let res = await exec();
      expect(res.status).toBe(400);
    });

    it('should save the genre if it is valid', async () => {
      await exec();
      const genre = await Genre.find({name: 'genre1'})
      expect(genre).not.toBeNull();
    });

    it('should return the genre if it is valid', async () => {
      let res = await exec();
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1')
    });
  });
});