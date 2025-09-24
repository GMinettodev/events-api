const EventModel = require('../models/eventModel');
const createError = require('http-errors');

class EventService {
  static async getEvents() {
    return EventModel.findAll();
  }

  static async createEvent(eventData, userId) {
    if (!userId) {
      throw createError(404, 'User ID is required to create an event');
    }

    // Validate date
    const eventDate = new Date(eventData.date);
    const now = new Date();

    if (isNaN(eventDate.getTime())) {
      throw createError(400, 'Invalid event date format');
    }

    if (eventDate < now) {
      throw createError(400, 'Event date cannot be in the past');
    }

    const eventToCreate = {
      ...eventData,
      created_by: userId,
    };

    const insertedId = await EventModel.create(eventToCreate);

    return insertedId;
  }
}

module.exports = EventService;
