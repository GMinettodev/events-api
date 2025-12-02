const request = require('supertest');
const { app } = require('../../app');
const prisma = require('../../config/prisma');

const ADMIN_USER = {
  email: 'admin.dashboard@test.com',
  password: 'adminpassword',
  role: 'admin',
};

const VOLUNTEER_USER = {
  email: 'volunteer.dashboard@test.com',
  password: 'volpassword',
  role: 'volunteer',
};

let volunteerToken = '';
let adminToken = '';

beforeAll(async () => {
  await prisma.user.deleteMany({
    where: { email: { in: [VOLUNTEER_USER.email, ADMIN_USER.email] } },
  });

  await request(app).post('/auth/register').send(VOLUNTEER_USER);
  await request(app).post('/auth/register').send(ADMIN_USER);

  // Login Volunteer
  let response = await request(app)
    .post('/auth/login')
    .send({ email: VOLUNTEER_USER.email, password: VOLUNTEER_USER.password });
  volunteerToken = response.body.token;

  // Login Admin
  response = await request(app)
    .post('/auth/login')
    .send({ email: ADMIN_USER.email, password: ADMIN_USER.password });
  adminToken = response.body.token;
});

afterAll(async () => {
  await prisma.user.deleteMany({
    where: { email: { in: [VOLUNTEER_USER.email, ADMIN_USER.email] } },
  });
  await prisma.$disconnect();
});

describe('Dashboard Routes', () => {
  it('should allow access to GET / (Public Route) without token', async () => {
    const response = await request(app).get('/protected/');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return 401 if trying to access /dashboard without token', async () => {
    const response = await request(app).get('/protected/dashboard');
    expect(response.statusCode).toBe(401);
  });
});
