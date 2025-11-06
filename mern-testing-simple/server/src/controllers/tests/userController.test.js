const request = require('supertest');
const app = require('../../server');
const User = require('../../models/User');

describe('User Controller', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('GET /api/users', () => {
    test('should get all users', async () => {
      await User.create([
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' }
      ]);

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('POST /api/users', () => {
    test('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        age: 25
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test User');
      expect(response.body.data.email).toBe('test@example.com');
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });
  });
});