const groupRepository = require('../repositories/group.repository');

class GroupService {
  async getAllGroups() {
    return groupRepository.findAll();
  }

  async getGroupById(id) {
    return groupRepository.findById(id);
  }

  async createGroup(data) {
    return groupRepository.create(data);
  }

  async updateGroup(id, data) {
    return groupRepository.update(id, data);
  }

  async deleteGroup(id) {
    return groupRepository.delete(id);
  }
}

module.exports = new GroupService();
