const db = require('../config/database');

class EventModel {
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM events');
    return rows;
  }

  static async create(event) {
    const {
      title,
      description,
      date,
      location,
      max_volunteers = 50,
      created_by,
      created_at,
    } = event;

    const [rows] = await db.query(
      'INSERT INTO events (title, description, date, location, max_volunteers, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        title,
        description,
        date,
        location,
        max_volunteers,
        created_by,
        created_at,
      ]
    );

    return rows.insertId;
  }
}

module.exports = EventModel;
