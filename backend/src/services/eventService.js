const EventModel = require('../models/eventModel');
const UserModel = require('../models/userModel');
const createError = require('http-errors');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

class EventService {
  /**
   * @description Retrieves all events from the Model.
   * @returns {Promise<Event[]>} An array of all events.
   */
  static async getEvents() {
    return EventModel.findAll(); 
  }

  /**
   * @description Creates a new event, including date validation.
   * @param {object} eventData - Event data.
   * @param {number} userId - The ID of the user creating the event.
   * @returns {Promise<{insertedId: number}>} The ID of the created event.
   */
  static async createEvent(eventData, userId) {
    if (!userId) throw createError(404, 'User ID is required');

    // Date Validation
    const eventDate = dayjs.utc(eventData.date).startOf('day');
    const today = dayjs.utc().startOf('day');

    if (!eventDate.isValid()) throw createError(400, 'Invalid date');
    if (eventDate.isBefore(today)) throw createError(400, 'Date cannot be in past');

    const eventToCreate = {
      ...eventData,
      // Prisma expects a native JS Date object, not a formatted string
      date: eventDate.toDate(), 
      created_by: userId, // This field is mapped to 'createdById' in the Model
    };

    const insertedId = await EventModel.create(eventToCreate);
    return insertedId;
  }

  /**
   * @description Updates an existing event, including permission check and date validation.
   * @param {number} id - The event's ID.
   * @param {object} eventData - Data to update.
   * @param {number} userId - The ID of the user performing the update (not used for permission here, but useful for context).
   * @returns {Promise<Event>} The updated event object.
   */
  static async updateEvent(id, eventData, userId) {
    const existingEvent = await EventModel.findById(id);
    if (!existingEvent) throw createError(404, 'Event not found');

    const fieldsToUpdate = { ...eventData };

    if (fieldsToUpdate.date) {
      const eventDate = dayjs.utc(fieldsToUpdate.date).startOf('day');
      const today = dayjs.utc().startOf('day');
      if (eventDate.isBefore(today)) throw createError(400, 'Date cannot be in past');
      
      // Convert to Date object for Prisma
      fieldsToUpdate.date = eventDate.toDate();
    }

    // Remove fields that should not be directly updated (managed by the DB/Prisma)
    delete fieldsToUpdate.created_at;
    delete fieldsToUpdate.created_by;

    return await EventModel.update(id, fieldsToUpdate);
  }

  /**
   * @description Retrieves all events for the dashboard view.
   * @returns {Promise<Event[]>} An array of events with creator details.
   */
  static async listEventsForDashboard() {
    // The Model already includes the creator details
    return EventModel.findAll(); 
  }

  /**
   * @description Deletes an event, including permission check.
   * @param {number} id - The event's ID.
   * @param {string} userEmail - The email of the user attempting to delete the event.
   * @returns {Promise<{message: string}>} Success message.
   */
  static async deleteEvent(id, userEmail) {
    const existingEvent = await EventModel.findById(id); 
    if (!existingEvent) throw createError(404, 'Event not found');

    const user = await UserModel.findByEmail(userEmail);
    
    // Permission Check (Business Logic)
    // Checks if the user is the creator (using createdById from Prisma) OR is an admin
    if (existingEvent.createdById !== user.id && user.role !== 'admin') {
      throw createError(403, 'Unauthorized');
    }

    await EventModel.delete(id);
    return { message: 'Event deleted successfully' };
  }
}

module.exports = EventService;