const request = require('supertest');
const { app } = require('../../app'); 
const prisma = require('../../config/prisma');

const mockAdmin = {
  name: 'Admin Tester',
  email: 'auth.admin@jest.com',
  password: 'adminpassword',
  role: 'admin',
};

beforeAll(async () => {
  // Cleans up the Admin test user to ensure a clean state
  await prisma.user.deleteMany({ where: { email: mockAdmin.email } });
});

afterAll(async () => {
  // Cleans up the Admin test user again
  await prisma.user.deleteMany({ where: { email: mockAdmin.email } });
  await prisma.$disconnect();
});

describe('POST /auth/register', () => {
  it('should register a new user (admin) successfully', async () => {
    const response = await request(app).post('/auth/register').send(mockAdmin);

    // Checks the HTTP Status 201 (Created)
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty(
      'message',
      'User created successfully'
    );
    expect(response.body).toHaveProperty('id');
  });

  it('should return 400 if user email already exists', async () => {
    // Tries to register the same Admin user again
    const response = await request(app).post('/auth/register').send(mockAdmin);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'User already exists');
  });
});

describe('POST /auth/login', () => {
  // This test relies on the Admin user being created in the 'register' suite

  it('should log in admin user successfully and return a token', async () => {
    const response = await request(app).post('/auth/login').send({
      email: mockAdmin.email,
      password: mockAdmin.password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('role', 'admin');
  });

  it('should return 400 for invalid password', async () => {
    const response = await request(app).post('/auth/login').send({
      email: mockAdmin.email,
      password: 'wrongpassword', // Wrong password
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid password');
  });

  it('should return 404 for non-existent user', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'nonexistent@user.com',
      password: mockAdmin.password,
    });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });
});