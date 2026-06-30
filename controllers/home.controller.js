const activityService = require('../services/activity.service');

class HomeController {
  async renderHome(req, res, next) {
    try {
      // Mock or fetch actual favorites, recents, and summary stats
      const favorites = [
        { id: 1, name: 'แก้ไข HOSxP', code: 'ACT-001' },
        { id: 2, name: 'ซ่อมเครื่องพิมพ์', code: 'ACT-002' },
        { id: 3, name: 'ตรวจสอบ Backup', code: 'ACT-003' },
        { id: 4, name: 'ประชุมกลุ่มงาน', code: 'ACT-004' },
        { id: 5, name: 'ดูแลระบบ Network', code: 'ACT-005' }
      ];

      const recents = [
        { time: '09:30', name: 'แก้ไข HOSxP ช้า', duration: 30, location: 'ห้องเซิร์ฟเวอร์' },
        { time: '11:15', name: 'แก้ไขคิว Printer', duration: 15, location: 'OPD (แผนกผู้ป่วยนอก)' },
        { time: '14:00', name: 'ตรวจสอบ MariaDB Backup', duration: 60, location: 'ห้องเซิร์ฟเวอร์' }
      ];

      const summary = {
        activityCount: 5,
        totalHours: 3.5
      };

      return res.render('layouts/main', {
        body: '../home/index',
        title: 'หน้าแรก | Work Insight',
        favorites,
        recents,
        summary,
        activeMenu: 'home'
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new HomeController();
