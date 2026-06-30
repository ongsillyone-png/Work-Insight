const { pool } = require('../config/database');

class CategoryRepository {
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
}

module.exports = new CategoryRepository();
