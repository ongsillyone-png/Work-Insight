const locationRepository = require('../repositories/location.repository');

class LocationService {
  async getAllLocations() {
    return locationRepository.findAll();
  }

  async getLocationById(id) {
    return locationRepository.findById(id);
  }

  async createLocation(data) {
    return locationRepository.create(data);
  }

  async updateLocation(id, data) {
    return locationRepository.update(id, data);
  }

  async deleteLocation(id) {
    return locationRepository.delete(id);
  }
}

module.exports = new LocationService();
