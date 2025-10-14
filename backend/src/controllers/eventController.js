const EventService = require('../services/eventService');
const createError = require('http-errors');

class EventController {
  static async createEvent(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createError(401, 'Authentication required');
      }

      const eventData = req.body;

      const newEventId = await EventService.createEvent(eventData, userId);

      res
        .status(201)
        .json({ message: 'New event created successfully!', id: newEventId });
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

  static async getDashboardEvents(req, res) {
    try {
      const events = await EventService.listEventsForDashboard();
      res.status(200).json(events);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: 'Erro ao buscar eventos para o dashboard' });
    }
  }

  static async updateEvent(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createError(401, 'Authentication required');
      }

      const { id } = req.params;
      const eventData = req.body;

      const updatedEvent = await EventService.updateEvent(
        id,
        eventData,
        userId
      );

      res
        .status(200)
        .json({ message: 'Event updated successfully!', event: updatedEvent });
    } catch (err) {
      next(err);
    }
  }

  static async deleteEvent(req, res, next) {
    try {
      // Access the email from req.user (set by the authenticateToken middleware)
      const userEmail = req.user?.email;
      if (!userEmail) {
        throw createError(401, 'Authentication required');
      }

      const { id } = req.params;

      // Call the service to delete the event
      const result = await EventService.deleteEvent(id, userEmail);

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = EventController;
