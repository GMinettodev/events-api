// prisma/seed/userSeed.js
const bcrypt = require('bcryptjs');

/**
 * @description Creates initial users (Admin and Volunteer) and returns them.
 * @param {PrismaClient} prisma - The Prisma client instance.
 * @returns {Promise<{admin: object, volunteer: object}>} Created user objects.
 */
async function userSeed(prisma) {
  const DEFAULT_PASSWORD = 'senha123';
  const SALT_ROUNDS = 10;
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  console.log('Seeding users...');

  // Clean up existing users (optional)
  await prisma.user.deleteMany();

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    },
  });

  const volunteerUser = await prisma.user.create({
    data: {
      name: 'Volunteer User',
      email: 'volunteer@example.com',
      password: hashedPassword,
      role: 'volunteer',
    },
  });

  console.log('User seeding complete.');
  return { admin: adminUser, volunteer: volunteerUser };
}

module.exports = userSeed;
