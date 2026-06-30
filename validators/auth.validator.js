const { body } = require('express-validator');

exports.loginRules = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('password')
    .notEmpty().withMessage('Password is required')
];

exports.profileRules = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
];
