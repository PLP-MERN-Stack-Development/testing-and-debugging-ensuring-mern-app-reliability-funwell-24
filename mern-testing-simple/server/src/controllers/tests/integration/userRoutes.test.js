const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/server');
const User = require('../../src/models/User');

describe('User Routes Integration', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/mern_testing_simple_test');
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('complete user CRUD flow', async () => {
    // Create user
    const userData = {
      name: 'Integration Test User',
      email: 'integration@example.com',
      age: 30
    };

    const createResponse = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201);

    const userId = createResponse.body.data._id;

    // Get user by ID
    const getResponse = await request(app)
      .get(`/api/users/${userId}`)
      .expect(200);

    expect(getResponse.body.data.name).toBe('Integration Test User');

    // Get all users
    const allResponse = await request(app)
      .get('/api/users')
      .expect(200);

    expect(allResponse.body.data).toHaveLength(1);
  });
});