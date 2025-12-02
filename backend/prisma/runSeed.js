const { PrismaClient } = require('@prisma/client');
const userSeed = require('./seed/userSeed');
const eventSeed = require('./seed/eventSeed');

/**
 * @file runSeed.js
 * @description Orchestrates the execution of all individual seed scripts.
 * This is the file specified in package.json for the 'prisma db seed' command.
 */
const prisma = new PrismaClient();

async function runSeed() {
  console.log('--- Starting full seed orchestration ---');
  try {
    // Step 1: Execute User Seed
    const users = await userSeed(prisma);

    // Step 2: Execute Event Seed, passing the created users
    await eventSeed(prisma, users);
  } catch (error) {
    console.error('ERROR DURING SEEDING:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log('--- Seeding orchestration finished ---');
  }
}

// Execute the main function
runSeed().catch((e) => {
  console.error(e);
  process.exit(1);
});
