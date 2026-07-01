const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, activityController.renderIndex);
router.get('/create', authMiddleware, activityController.renderCreate);
router.get('/edit/:id', authMiddleware, activityController.renderEdit);

// Form actions
router.post('/create', authMiddleware, activityController.createLog);
router.post('/edit/:id', authMiddleware, activityController.updateLog);
router.delete('/delete/:id', authMiddleware, activityController.deleteLog);

module.exports = router;
