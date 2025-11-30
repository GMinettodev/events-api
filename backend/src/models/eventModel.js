const prisma = require('../config/prisma');

class EventModel {
  /**
   * @description Retrieves all events ordered by date ascending.
   * @returns {Promise<Event[]>} An array of event objects.
   */
  static async findAll() {
    // READ with Ordering
    return await prisma.event.findMany({
      orderBy: { date: 'asc' },
      // Include to fetch related data (Join), as seen in section 5.2
      include: {
        creator: {
          select: { name: true, email: true },
        },
      },
    });
  }

  /**
   * @description Creates a new event record.
   * @param {object} eventData - Data required for event creation.
   * @returns {Promise<number>} The ID of the newly created event.
   */
  static async create(eventData) {
    // The PDF shows how to connect relations using 'data'
    const event = await prisma.event.create({
      data: {
        title: eventData.title,
        description: eventData.description,
        date: eventData.date, // Prisma accepts native JS Date object
        location: eventData.location,
        max_volunteers: parseInt(eventData.max_volunteers),
        // Connect the relationship manually by ID (created_by from service layer maps to createdById in schema)
        createdById: parseInt(eventData.created_by),
      },
    });
    return event.id;
  }

  /**
   * @description Finds an event by its unique ID.
   * @param {number} id - The event's ID.
   * @returns {Promise<Event | null>} The event object or null if not found.
   */
  static async findById(id) {
    return await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: { creator: { select: { name: true, email: true } } },
    });
  }

  /**
   * @description Updates an existing event record by ID.
   * @param {number} id - The event's ID.
   * @param {object} eventData - Data to update (e.g., title, description, date).
   * @returns {Promise<Event>} The updated event object.
   */
  static async update(id, eventData) {
    return await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        location: eventData.location,
        max_volunteers: parseInt(eventData.max_volunteers),
      },
    });
  }

  /**
   * @description Deletes an event record by ID.
   * @param {number} id - The event's ID.
   * @returns {Promise<Event>} The deleted event object.
   */
  static async delete(id) {
    return await prisma.event.delete({
      where: { id: parseInt(id) },
    });
  }
}

module.exports = EventModel;
