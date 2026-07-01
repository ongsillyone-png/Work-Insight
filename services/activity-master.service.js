const activityMasterRepository = require('../repositories/activity-master.repository');

class ActivityMasterService {
  async getAllActivities() {
    return activityMasterRepository.findAll();
  }

  async getActivityById(id) {
    return activityMasterRepository.findById(id);
  }

  async createActivity(data) {
    return activityMasterRepository.create(data);
  }

  async updateActivity(id, data) {
    return activityMasterRepository.update(id, data);
  }

  async deleteActivity(id) {
    return activityMasterRepository.delete(id);
  }
}

module.exports = new ActivityMasterService();
