const request = require('supertest');
const { app } = require('../../app');
const prisma = require('../../config/prisma');

// Users for testing permissions
const ADMIN_USER = {
  name: 'Admin Test',
  email: 'admin.user@users.com',
  password: 'adminpassword',
  role: 'admin',
};
const VOLUNTEER_USER = {
  name: 'Volunteer Test',
  email: 'volunteer.user@users.com',
  password: 'volpassword',
  role: 'volunteer',
};

let adminToken = '';
let volunteerToken = '';
let volunteerId = 0;

beforeAll(async () => {
  // Clear and register users
  await prisma.user.deleteMany({
    where: { email: { in: [ADMIN_USER.email, VOLUNTEER_USER.email] } },
  });

  await request(app).post('/auth/register').send(ADMIN_USER);
  await request(app).post('/auth/register').send(VOLUNTEER_USER);

  // Admin Login
  const adminLogin = await request(app)
    .post('/auth/login')
    .send({ email: ADMIN_USER.email, password: ADMIN_USER.password });
  adminToken = adminLogin.body.token;

  // Volunteer Login (non-admin)
  const volLogin = await request(app)
    .post('/auth/login')
    .send({ email: VOLUNTEER_USER.email, password: VOLUNTEER_USER.password });
  volunteerToken = volLogin.body.token;
  volunteerId = volLogin.body.user.id; // Stores the Volunteer ID
});

afterAll(async () => {
  // Clear all test users (including the temporary one)
  await prisma.user.deleteMany({
    where: {
      email: {
        in: [ADMIN_USER.email, VOLUNTEER_USER.email, 'temp@mail.com'],
      },
    },
  });
  await prisma.$disconnect();
});

describe('User Routes Integration Tests', () => {
  // --- GET /users/:id TESTS (ANY LOGGED-IN USER) ---
  it('should allow a volunteer to GET a user by ID', async () => {
    const response = await request(app)
      .get(`/users/${volunteerId}`)
      .set('Authorization', `Bearer ${volunteerToken}`); // Volunteer Token

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', volunteerId);
  });

  it('should return 401 if getting user by ID without token', async () => {
    const response = await request(app).get(`/users/${volunteerId}`);
    expect(response.statusCode).toBe(401);
  });

  // --- GET /users TESTS (ADMIN ONLY) ---
  it('should allow admin to GET all users', async () => {
    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });

  it('should return 403 if volunteer tries to GET all users', async () => {
    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${volunteerToken}`);

    expect(response.statusCode).toBe(403); // Forbidden
  });

  // --- PUT /users/:id and DELETE /users/:id TESTS (ADMIN ONLY) ---

  it('should allow admin to PUT (update) a user', async () => {
    const response = await request(app)
      .put(`/users/${volunteerId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Volunteer Updated by Admin' });

    expect(response.statusCode).toBe(200);
  });

  it('should return 403 if volunteer tries to PUT (update) a user', async () => {
    const response = await request(app)
      .put(`/users/${volunteerId}`)
      .set('Authorization', `Bearer ${volunteerToken}`) // Volunteer Token
      .send({ name: 'Hacker Attempt' });

    expect(response.statusCode).toBe(403);
  });

  it('should allow admin to DELETE a user', async () => {
    const response = await request(app)
      .delete(`/users/${volunteerId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(204); // Should be 204 for successful DELETE

    // Check in the DB
    const check = await prisma.user.findUnique({ where: { id: volunteerId } });
    expect(check).toBeNull();
  });

  it('should return 403 if volunteer tries to DELETE a user', async () => {
    // Create a new temporary user to delete
    const tempUser = await request(app)
      .post('/auth/register')
      .send({ ...VOLUNTEER_USER, email: 'temp@mail.com' });
    const tempId = tempUser.body.id;

    const response = await request(app)
      .delete(`/users/${tempId}`)
      .set('Authorization', `Bearer ${volunteerToken}`);

    expect(response.statusCode).toBe(401);
  });
});
