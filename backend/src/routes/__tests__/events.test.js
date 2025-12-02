const request = require('supertest');
const { app } = require('../../app');
const prisma = require('../../config/prisma');
const dayjs = require('dayjs');

// 1. Data for Login and Permissions
const ADMIN_USER = {
  email: 'admin.event@test.com',
  password: 'adminpass',
  role: 'admin',
  name: 'Admin',
};
const VOLUNTEER_USER = {
  email: 'volunteer.event@test.com',
  password: 'volpass',
  role: 'volunteer',
  name: 'Volunteer',
};

// 2. State variables
let adminToken = '';
let volunteerToken = '';
let createdEventId = 0;

// 3. Test Data
const FUTURE_DATE_STRING = dayjs().add(7, 'day').format('YYYY-MM-DD');
const NEW_EVENT = {
  title: 'Jest Event',
  description: 'Test event for CRUD',
  date: FUTURE_DATE_STRING,
  location: 'Online',
  max_volunteers: 50,
};

beforeAll(async () => {
  // Clear and register users
  await prisma.user.deleteMany({
    where: { email: { in: [ADMIN_USER.email, VOLUNTEER_USER.email] } },
  });
  await request(app).post('/auth/register').send(ADMIN_USER);
  await request(app).post('/auth/register').send(VOLUNTEER_USER);

  // Admin Login
  const adminLogin = await request(app).post('/auth/login').send(ADMIN_USER);
  adminToken = adminLogin.body.token;

  // Volunteer Login
  const volLogin = await request(app).post('/auth/login').send(VOLUNTEER_USER);
  volunteerToken = volLogin.body.token;
});

afterAll(async () => {
  // Cleanup: Deletes the Admin and Volunteer users
  await prisma.user.deleteMany({
    where: { email: { in: [ADMIN_USER.email, VOLUNTEER_USER.email] } },
  });
  // Cleanup: Deletes the created event
  if (createdEventId > 0) {
    await prisma.event
      .delete({ where: { id: createdEventId } })
      .catch(() => {});
  }
  await prisma.$disconnect();
});

describe('Event Routes Integration Tests', () => {
  // --- PUBLIC ROUTE TEST (GET /events) ---
  it('should allow public access to GET /events', async () => {
    const response = await request(app).get('/events');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // --- AUTHORIZATION TESTS (POST/PUT/DELETE) ---

  it('should return 401 if trying to POST event without a token', async () => {
    const response = await request(app).post('/events').send(NEW_EVENT);
    expect(response.statusCode).toBe(401); // Unauthorized
  });

  it('should return 403 if VOLUNTEER tries to POST event (Admin Only)', async () => {
    const response = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${volunteerToken}`)
      .send(NEW_EVENT);

    expect(response.statusCode).toBe(403); // Forbidden
  });

  // --- POST /events (Admin Only) ---
  it('should allow ADMIN to create a new event successfully', async () => {
    const response = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${adminToken}`) // Admin Token
      .send(NEW_EVENT);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    createdEventId = response.body.id;
  });

  // --- PUT /events/:id (Admin Only) ---
  it('should allow ADMIN to update the created event', async () => {
    const updateData = { title: 'Updated Title' };

    const response = await request(app)
      .put(`/events/${createdEventId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateData);

    expect(response.statusCode).toBe(200);
    expect(response.body.event).toHaveProperty('title', 'Updated Title');
  });

  it('should return 403 if VOLUNTEER tries to PUT event', async () => {
    const response = await request(app)
      .put(`/events/${createdEventId}`)
      .set('Authorization', `Bearer ${volunteerToken}`)
      .send({ title: 'Hacker attempt' });

    expect(response.statusCode).toBe(403);
  });

  // --- DELETE /events/:id (Admin Only) ---
  it('should allow ADMIN to delete the event successfully', async () => {
    const response = await request(app)
      .delete(`/events/${createdEventId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(204);
  });
});
