const EventModel = require('../models/eventModel');
const UserModel = require('../models/userModel');
const createError = require('http-errors');

class EventService {
  static async getEvents() {
    return EventModel.findAll();
  }

  static async createEvent(eventData, userId) {
    if (!userId) {
      throw createError(404, 'User ID is required to create an event');
    }

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
      created_at: new Date(),
    };

    const insertedId = await EventModel.create(eventToCreate);

    return insertedId;
  }

  static async updateEvent(id, eventData, userId) {
    if (!userId) {
      throw createError(401, 'User ID is required to update an event');
    }

    const existingEvent = await EventModel.findById(id);
    if (!existingEvent) {
      throw createError(404, 'Event not found');
    }

    const { created_at, created_by, ...fieldsToUpdate } = eventData;

    if (fieldsToUpdate.date) {
      const eventDate = new Date(fieldsToUpdate.date);
      const now = new Date();
      if (isNaN(eventDate.getTime())) {
        throw createError(400, 'Invalid event date format');
      }

      if (eventDate < now) {
        throw createError(400, 'Event date cannot be in the past');
      }
    }

    const updatedEvent = await EventModel.update(id, fieldsToUpdate);

    return updatedEvent;
  }

  static async listEventsForDashboard() {
    const events = await EventModel.getAllEventsWithUser();
    return events;
  }

  static async deleteEvent(id, userEmail) {
    if (!userEmail) {
      throw createError(401, 'User email is required to delete an event');
    }

    // Get the event by ID
    const existingEvent = await EventModel.findById(id);
    if (!existingEvent) {
      throw createError(404, 'Event not found');
    }

    // Find the user by email (you can use the findByEmail method you already have)
    const user = await UserModel.findByEmail(userEmail);
    if (!user) {
      throw createError(404, 'User not found');
    }

    // Check if the user is the event creator or an admin
    if (existingEvent.created_by !== user.id && user.role !== 'admin') {
      throw createError(403, 'You are not authorized to delete this event');
    }

    // Proceed to delete the event
    await EventModel.delete(id);

    return { message: 'Event deleted successfully' };
  }
}

module.exports = EventService;
