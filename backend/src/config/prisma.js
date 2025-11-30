// backend/src/config/prisma.js
const { PrismaClient } = require('@prisma/client');

/**
 * @file prisma.js
 * @description Global and unique instance of Prisma Client (Singleton Pattern).
 * This ensures that the application uses a single connection pool.
 */
const prisma = new PrismaClient();

// Recommendation: Gracefully shut down the Prisma Client before exiting the application
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
