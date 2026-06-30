const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const permissionMiddleware = require('../middlewares/permission.middleware');
const { ROLES } = require('../utils/constants');

// Restrict user management to Admin only
router.get('/', authMiddleware, permissionMiddleware([ROLES.ADMIN]), userController.renderIndex);

module.exports = router;
