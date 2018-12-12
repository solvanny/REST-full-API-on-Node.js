const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const mongoose = require('mongoose');
const server = require('../../index');


describe('/api/genres', () => {
  beforeEach(() => { server })
  afterEach(async () => { 
    await server.close(); 
    await Genre.deleteOne({});
  });

  describe('GET /', () => {
    it('should return all genres', async () => {
      let genres = [
        { name: 'genre1' },
        { name: 'genre2' },
      ];
      
      await Genre.collection.insertMany(genres);

      let res = await request(server).get('/api/genres');
      
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
      expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return a genre if valid id is passed', async () => {
      let genre = new Genre({ name: 'genre1' });
      await genre.save();

      let res = await request(server).get('/api/genres/' + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', genre.name);     
    });

    it('should return 404 if invalid id is passed', async () => {
      let res = await request(server).get('/api/genres/1');

      expect(res.status).toBe(404);
    });

    it('should return 404 if no genre with the given id exists', async () => {
      let id = mongoose.Types.ObjectId();
      let res = await request(server).get('/api/genres/' + id);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {

    // Define the happy path, and then in each test, we change 
    // one parameter that clearly aligns with the name of the 
    // test. 
    let token; 
    let name; 

    const exec = async () => {
      return await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name });
    }

    beforeEach(() => {
      token = new User().generateAuthToken();      
      name = 'genre1'; 
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      let res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if genre is less than 5 characters', async () => {
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

      let genre = await Genre.find({ name: 'genre1' });

      expect(genre).not.toBeNull();
    });

    it('should return the genre if it is valid', async () => {
      let res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1');
    });
  });

  describe('PUT /:id', () => {
    let token; 
    let newName; 
    let genre; 
    let id; 

    const exec = async () => {
      return await request(server)
        .put('/api/genres/' + id)
        .set('x-auth-token', token)
        .send({ name: newName });
    }

    beforeEach(async () => {
      // Before each test we need to create a genre and 
      // put it in the database.      
      genre = new Genre({ name: 'genre1' });
      await genre.save();
      
      token = new User().generateAuthToken();     
      id = genre._id; 
      newName = 'updatedName'; 
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      let res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if genre is less than 5 characters', async () => {
      newName = '1234'; 
      
      let res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if genre is more than 50 characters', async () => {
      newName = new Array(52).join('a');

      let res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 401 if id is invalid', async () => {
      id = 1;

      const res = await request(server).put('/api/genres/' + id);

      expect(res.status).toBe(401);
    });

    it('should return 404 if genre with the given id was not found', async () => {
    
      let res = await request(server).get('/api/genres/1');

      expect(res.status).toBe(404);
    });

    it('should update the genre if input is valid', async () => {
      await exec();

      let updatedGenre = await Genre.findById(genre._id);

      expect(updatedGenre.name).toBe(newName);
    });

    it('should return the updated genre if it is valid', async () => {
      let res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', newName);
    });
  });  

  describe('DELETE /:id', () => {
    let token; 
    let genre; 
    let id; 

    const exec = async () => {
      return await request(server)
        .delete('/api/genres/' + id)
        .set('x-auth-token', token)
        .send();
    }

    beforeEach(async () => {
      // Before each test we need to create a genre and 
      // put it in the database.      
      genre = new Genre({ name: 'genre1' });
      await genre.save();
      
      id = genre._id; 
      token = new User({ isAdmin: true }).generateAuthToken();     
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      let res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 403 if the user is not an admin', async () => {
      token = new User({ isAdmin: false }).generateAuthToken(); 

      let res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 401 if id is invalid', async () => {
      id = 1; 
      
      let res = await request(server).put('/api/genres/1');

      expect(res.status).toBe(401);
    });

    it('should return 401 if no genre with the given id was found', async () => {
      id = mongoose.Types.ObjectId();

      let res = await exec();

      expect(res.status).toBe(401);
    });

    it('should delete the genre if input is valid', async () => {
      await exec();

      let genreInDb = await Genre.findById(id);

      expect(genreInDb).toBeNull();
    });

    it('should return the removed genre', async () => {
      let res = await exec();

      expect(res.body).toHaveProperty('_id', genre._id.toHexString());
      expect(res.body).toHaveProperty('name', genre.name);
    });
  });  
});