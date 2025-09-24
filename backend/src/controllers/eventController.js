const EventService = require('../services/eventService');
const createError = require('http-errors');

class EventController {
  static async createEvent(req, res, next) {
    try {
      // Assuming you have auth middleware that sets req.user
      const userId = req.user?.id;
      if (!userId) {
        throw createError(401, 'Authentication required');
      }

      const eventData = req.body;

      // Call service to create event
      const newEventId = await EventService.createEvent(eventData, userId);

      res.status(201).json({ message:'New event created successfully!', id: newEventId });
    } catch (err) {
      next(err);
    }
  }

  static async getEvents(req, res, next) {
    try {
      const events = await EventService.getEvents();
      res.json(events);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = EventController;
