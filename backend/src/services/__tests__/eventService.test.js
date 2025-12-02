const EventService = require('../eventService');
const EventModel = require('../../models/eventModel');
const UserModel = require('../../models/userModel');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

jest.mock('../../models/eventModel');
jest.mock('../../models/userModel');

const tomorrow = dayjs.utc().add(1, 'day').format('YYYY-MM-DD');
const yesterday = dayjs.utc().subtract(1, 'day').format('YYYY-MM-DD');

describe('EventService Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- CREATE EVENT ---
  describe('createEvent', () => {
    it('should create event if date is valid', async () => {
      const eventData = { title: 'New Event', date: tomorrow };
      EventModel.create.mockResolvedValue(10);

      const insertedId = await EventService.createEvent(eventData, 1);

      expect(EventModel.create).toHaveBeenCalled();
      expect(insertedId).toBe(10);
    });

    it('should throw 400 if date is in the past', async () => {
      const eventData = { title: 'Old Event', date: yesterday };

      await expect(EventService.createEvent(eventData, 1)).rejects.toThrow();

      expect(EventModel.create).not.toHaveBeenCalled();
    });

    it('should throw 404 if userId is missing', async () => {
      await expect(EventService.createEvent({}, null)).rejects.toHaveProperty(
        'status',
        404
      );
    });
  });

  // --- UPDATE EVENT ---
  describe('updateEvent', () => {
    it('should update event successfully', async () => {
      EventModel.findById.mockResolvedValue({ id: 1 });
      EventModel.update.mockResolvedValue({ id: 1, title: 'Updated' });

      const result = await EventService.updateEvent(1, { title: 'Updated' }, 1);
      expect(result.title).toBe('Updated');
    });

    it('should throw 404 if event does not exist', async () => {
      EventModel.findById.mockResolvedValue(null);
      await expect(EventService.updateEvent(999, {}, 1)).rejects.toHaveProperty(
        'status',
        404
      );
    });
  });

  // --- DELETE EVENT (Lógica de Permissão) ---
  describe('deleteEvent', () => {
    it('should allow creator to delete event', async () => {
      EventModel.findById.mockResolvedValue({ id: 1, createdById: 5 });
      UserModel.findByEmail.mockResolvedValue({ id: 5, role: 'volunteer' });

      const result = await EventService.deleteEvent(1, 'creator@mail.com');

      expect(EventModel.delete).toHaveBeenCalledWith(1);
      expect(result.message).toContain('deleted successfully');
    });

    it('should allow admin to delete any event', async () => {
      EventModel.findById.mockResolvedValue({ id: 1, createdById: 5 });
      UserModel.findByEmail.mockResolvedValue({ id: 99, role: 'admin' });

      await EventService.deleteEvent(1, 'admin@mail.com');
      expect(EventModel.delete).toHaveBeenCalled();
    });

    it('should deny (403) if user is not creator and not admin', async () => {
      EventModel.findById.mockResolvedValue({ id: 1, createdById: 5 });
      UserModel.findByEmail.mockResolvedValue({ id: 7, role: 'volunteer' });

      await expect(
        EventService.deleteEvent(1, 'hacker@mail.com')
      ).rejects.toHaveProperty('status', 403);

      expect(EventModel.delete).not.toHaveBeenCalled();
    });
  });
});
