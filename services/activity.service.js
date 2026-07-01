const activityRepository = require('../repositories/activity.repository');

class ActivityService {
  async getAllActivities() {
    return activityRepository.findAll();
  }

  async getActivityById(id) {
    return activityRepository.findById(id);
  }

  async createActivity(data) {
    return activityRepository.create(data);
  }

  async updateActivity(id, data) {
    return activityRepository.update(id, data);
  }

  async deleteActivity(id) {
    return activityRepository.delete(id);
  }

  async getFavoriteActivities(userId) {
    return activityRepository.findFavoritesByUser(userId);
  }

  async getLoggedActivities(userId, filters = {}) {
    return activityRepository.findLogsByUser(userId, filters);
  }
}

module.exports = new ActivityService();
