const request = require('supertest');
const server = require('../../index');
const { Genre } = require('../../models/genre');

describe('/api/genres',  () => {
 
  beforeEach(() => { server });
  afterEach( async () => { 
    server.close();
    await Genre.deleteMany({});
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
  });

  describe('GET /:id', () => {
    it ('should return error 404 if invalid id is passed ', async () => {
     
      let res = await request(server).get('/api/genres/1');

      expect(res.status).toBe(404);
    });
  });
});