const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authValidator = require('../validators/auth.validator');

router.get('/login', authController.renderLogin);
router.post('/login', authValidator.loginRules, authController.login);
router.get('/logout', authController.logout);

module.exports = router;
