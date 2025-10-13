const db = require('../config/database');

class UserModel {
  static async create(user) {
    const { name, email, password, role = 'volunteer' } = user;
    const [rows] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );
    return rows.insertId;
  }

  static async findAll() {
    const [rows] = await db.query('SELECT id, name, email, role FROM users');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [
      email,
    ]);
    return rows[0];
  }

  // static async update(id, user) {
  //   const { name, email, password, phone, role } = user;
  //   const [rows] = await db.query(
  //     'UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id =  ?',
  //     [name, email, password, role, id]
  //   );
  //   return rows;
  // }
  static async update(id, user) {
    const { name, email, password, role } = user;

    if (password) {
      // update including password
      const [rows] = await db.query(
        'UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?',
        [name, email, password, role, id]
      );
      return rows;
    } else {
      // update without password
      const [rows] = await db.query(
        'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
        [name, email, role, id]
      );
      return rows;
    }
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result;
  }
}

module.exports = UserModel;
