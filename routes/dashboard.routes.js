const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, dashboardController.renderDashboard);
router.get('/export-data', authMiddleware, dashboardController.getExportData);

module.exports = router;
