const prisma = require('../config/prisma');

class UserModel {
  /**
   * @description Creates a new user record.
   * @param {object} userData - User data (name, email, password, role).
   * @returns {Promise<number>} The ID of the newly created user.
   */
  static async create(userData) {
    const { name, email, password, role } = userData;
    // CREATE - Inserting a new record
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role,
      },
    });
    return user.id;
  }

  /**
   * @description Retrieves all users.
   * @returns {Promise<User[]>} An array of user objects (without password).
   */
  static async findAll() {
    // READ - Querying data
    return await prisma.user.findMany({
      // Select specific fields to omit the password
      select: { id: true, name: true, email: true, role: true },
    });
  }

  /**
   * @description Finds a user by their unique ID.
   * @param {number} id - The user's ID.
   * @returns {Promise<User | null>} The user object or null if not found.
   */
  static async findById(id) {
    return await prisma.user.findUnique({
      // The PDF highlights that unique searches require 'where'
      where: { id: parseInt(id) },
    });
  }

  /**
   * @description Finds a user by their unique email address.
   * @param {string} email - The user's email.
   * @returns {Promise<User | null>} The user object or null if not found.
   */
  static async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email: email },
    });
  }

  /**
   * @description Updates an existing user record by ID.
   * @param {number} id - The user's ID.
   * @param {object} userData - Data to update (e.g., name, email, role, password).
   * @returns {Promise<User>} The updated user object.
   */
  static async update(id, userData) {
    // UPDATE - Updating records
    // Prisma ignores undefined fields, so we build the object only with the incoming data
    const dataToUpdate = {
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };
    if (userData.password) dataToUpdate.password = userData.password;

    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
    });
  }

  /**
   * @description Deletes a user record by ID.
   * @param {number} id - The user's ID.
   * @returns {Promise<User>} The deleted user object.
   */
  static async delete(id) {
    // DELETE - Deleting records
    return await prisma.user.delete({
      where: { id: parseInt(id) },
    });
  }
}

module.exports = UserModel;
