const EventService = require('../services/eventService');
const createError = require('http-errors');

/**
 * Controller class responsible for handling HTTP requests related to events.
 */
class EventController {
  /**
   * Handles creating a new event.
   * Requires user authentication.
   * @param {Object} req - Express request object, expects event data in req.body and user info in req.user.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
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

  /**
   * Retrieves all events.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  static async getEvents(req, res, next) {
    try {
      const events = await EventService.getEvents();
      res.json(events);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves events formatted for the dashboard display.
   * Returns a 500 status with an error message if an exception occurs.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  static async getDashboardEvents(req, res) {
    try {
      const events = await EventService.listEventsForDashboard();
      res.status(200).json(events);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching dashboard events' });
    }
  }

  /**
   * Updates an existing event.
   * Requires user authentication.
   * @param {Object} req - Express request object, expects event ID in req.params and updated data in req.body.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
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

  /**
   * Deletes an event.
   * Requires user authentication.
   * @param {Object} req - Express request object, expects event ID in req.params and user email in req.user.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  static async deleteEvent(req, res, next) {
    try {
      // Access the email from req.user (set by the authenticateToken middleware)
      const userEmail = req.user?.email;
      if (!userEmail) {
        throw createError(401, 'Authentication required');
      }

      const { id } = req.params;

      // Call the service to delete the event
      await EventService.deleteEvent(id, userEmail);

      // FIX: Use 204 (No Content) for successful DELETE operations
      res.status(204).send(); // <-- Correct status code for DELETE without content
    } catch (err) {
      next(err);
    }
  }
}

module.exports = EventController;
