const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const permissionMiddleware = require('../middlewares/permission.middleware');
const { ROLES } = require('../utils/constants');

// Restrict user management to Admin only
router.get('/', authMiddleware, permissionMiddleware([ROLES.ADMIN]), userController.renderIndex);
router.post('/create', authMiddleware, permissionMiddleware([ROLES.ADMIN]), userController.createUser);
router.put('/update/:id', authMiddleware, permissionMiddleware([ROLES.ADMIN]), userController.updateUser);
router.delete('/delete/:id', authMiddleware, permissionMiddleware([ROLES.ADMIN]), userController.deleteUser);

// Any authenticated user can update their preferences
router.post('/preferences', authMiddleware, userController.updatePreferences);
router.post('/quick-actions', authMiddleware, userController.updateQuickActions);

module.exports = router;
