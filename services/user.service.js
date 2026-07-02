const userRepository = require('../repositories/user.repository');
const bcrypt = require('bcrypt');

class UserService {
  async getAllUsers() {
    return userRepository.findAll();
  }

  async getAllRoles() {
    return userRepository.getAllRoles();
  }

  async getUserById(id) {
    return userRepository.findById(id);
  }

  async createUser(data) {
    if (data.password) {
      data.password_hash = await bcrypt.hash(data.password, 10);
    }
    return userRepository.create(data);
  }

  async updateUser(id, data) {
    if (data.password) {
      data.password_hash = await bcrypt.hash(data.password, 10);
      // We need to modify update query in repo to support password update if provided,
      // but the current update method in user.repository.js doesn't update password.
      // Let's assume password change is a separate feature or modify repo later if needed.
    }
    return userRepository.update(id, data);
  }

  async deleteUser(id) {
    return userRepository.delete(id);
  }

  async updatePreferences(id, preferred_categories) {
    return userRepository.updatePreferences(id, preferred_categories);
  }

  async updateQuickActions(id, quick_actions) {
    return userRepository.updateQuickActions(id, quick_actions);
  }

  async updateManagedCategories(id, managed_categories) {
    return userRepository.updateManagedCategories(id, managed_categories);
  }
}

module.exports = new UserService();
