const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, activityController.renderIndex);
router.get('/create', authMiddleware, activityController.renderCreate);
router.get('/edit/:id', authMiddleware, activityController.renderEdit);

module.exports = router;
