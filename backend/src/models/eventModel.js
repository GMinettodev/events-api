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
    } = event;

    const [rows] = await db.query(
      'INSERT INTO events (title, description, date, location, max_volunteers, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [title, description, date, location, max_volunteers, created_by]
    );

    return rows.insertId;
  }

  static async getAllEventsWithUser() {
    const [rows] = await db.query(`
      SELECT 
        e.id, e.title, e.description, e.date, e.location, e.max_volunteers, 
        u.name AS created_by_name, u.email AS created_by_email
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      ORDER BY e.date ASC
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, event) {
    const { title, description, date, location, max_volunteers } = event;

    const [rows] = await db.query(
      'UPDATE events SET title = ?, description = ?, date = ?, location = ?, max_volunteers = ? WHERE id = ?',
      [title, description, date, location, max_volunteers, id]
    );

    return rows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM events WHERE id = ?', [id]);
    return result;
  }
}

module.exports = EventModel;
