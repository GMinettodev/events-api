/**
 * @description Creates initial events linked to the provided user objects.
 * @param {PrismaClient} prisma - The Prisma client instance.
 * @param {object} users - Object containing the created users ({admin, volunteer}).
 */
async function eventSeed(prisma, users) {
  console.log('Seeding events...');

  // Clean up existing events (optional)
  await prisma.event.deleteMany();

  // Event created by the Admin
  await prisma.event.create({
    data: {
      title: 'Community Clean-up Day',
      description: 'Join us to clean the downtown park and surrounding areas.',
      date: new Date('2026-03-15T09:00:00.000Z'),
      location: 'Downtown Central Park',
      max_volunteers: 50,
      createdById: users.admin.id,
    },
  });

  // Event created by the Volunteer
  await prisma.event.create({
    data: {
      title: 'Food Bank Distribution',
      description:
        'Help organize and distribute food packages for families in need.',
      date: new Date('2026-04-10T14:30:00.000Z'),
      location: 'Main Community Center',
      max_volunteers: 30,
      createdById: users.volunteer.id,
    },
  });

  console.log('Event seeding complete.');
}

module.exports = eventSeed;
