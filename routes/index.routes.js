const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const dashboardRoutes = require('./dashboard.routes');
const activityRoutes = require('./activity.routes');
const categoryRoutes = require('./category.routes');
const userRoutes = require('./user.routes');
const locationRoutes = require('./location.routes');
const activityMasterRoutes = require('./activity-master.routes');

const settingController = require('../controllers/setting.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const homeController = require('../controllers/home.controller');

// Root Route - redirect to home
router.get('/', (req, res) => {
  res.redirect('/home');
});

router.get('/home', authMiddleware, homeController.renderHome);

// Register Modules
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/activity', activityRoutes);
router.use('/category', categoryRoutes);
router.use('/users', userRoutes);
router.use('/locations', locationRoutes);
router.use('/activity-master', activityMasterRoutes);

// Settings Module Route
router.get('/settings', authMiddleware, settingController.renderIndex);
router.post('/settings/update', authMiddleware, settingController.updateSettings);

module.exports = router;
