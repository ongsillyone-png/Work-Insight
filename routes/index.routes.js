const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const dashboardRoutes = require('./dashboard.routes');
const activityRoutes = require('./activity.routes');
const categoryRoutes = require('./category.routes');
const userRoutes = require('./user.routes');

const settingController = require('../controllers/setting.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Root Route - redirect to dashboard
router.get('/', (req, res) => {
  res.redirect('/dashboard');
});

// Register Modules
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/activity', activityRoutes);
router.use('/category', categoryRoutes);
router.use('/users', userRoutes);

// Settings Module Route
router.get('/settings', authMiddleware, settingController.renderIndex);

module.exports = router;
