const locationService = require('../services/location.service');

class LocationController {
  async renderIndex(req, res, next) {
    try {
      const locations = await locationService.getAllLocations();
      return res.render('layouts/main', {
        body: '../locations/index',
        title: 'Manage Locations | Work Insight',
        locations,
        activeMenu: 'locations'
      });
    } catch (err) {
      next(err);
    }
  }

  async createLocation(req, res, next) {
    try {
      const { name, description, is_active } = req.body;
      await locationService.createLocation({ 
        name, 
        description, 
        is_active: is_active !== undefined ? parseInt(is_active, 10) : 1 
      });
      return res.redirect('/locations');
    } catch (err) {
      next(err);
    }
  }

  async updateLocation(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description, is_active } = req.body;
      await locationService.updateLocation(id, { 
        name, 
        description, 
        is_active: is_active !== undefined ? parseInt(is_active, 10) : 1 
      });
      return res.json({ success: true, message: 'สถานที่ถูกอัปเดตเรียบร้อยแล้ว' });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async deleteLocation(req, res, next) {
    try {
      const { id } = req.params;
      await locationService.deleteLocation(id);
      return res.json({ success: true, message: 'ลบสถานที่เรียบร้อยแล้ว' });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = new LocationController();
