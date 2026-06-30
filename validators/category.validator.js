const { body } = require('express-validator');

exports.categoryRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 2 }).withMessage('Category name must be at least 2 characters long')
];
