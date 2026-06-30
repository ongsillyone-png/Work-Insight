const { pool } = require('../config/database');

class ActivityRepository {
  async findAll() {
    return [];
  }

  async findById(id) {
    return null;
  }

  async create(data) {
    return null;
  }

  async update(id, data) {
    return null;
  }

  async delete(id) {
    return null;
  }

  async findFavoritesByUser(userId) {
    return [];
  }

  async findLogsByUser(userId) {
    return [];
  }
}

module.exports = new ActivityRepository();
