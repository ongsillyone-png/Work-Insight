const express = require('express');
const router = express.Router();
const activityMasterController = require('../controllers/activity-master.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, activityMasterController.renderIndex);
router.post('/create', authMiddleware, activityMasterController.createActivity);
router.put('/update/:id', authMiddleware, activityMasterController.updateActivity);
router.delete('/delete/:id', authMiddleware, activityMasterController.deleteActivity);

module.exports = router;
