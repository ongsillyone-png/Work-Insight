const { body } = require('express-validator');

exports.createActivityRules = [
  body('code')
    .trim()
    .notEmpty().withMessage('Activity code is required'),
  body('name')
    .trim()
    .notEmpty().withMessage('Activity name is required'),
  body('categoryId')
    .notEmpty().withMessage('Category is required')
    .isInt().withMessage('Category ID must be an integer'),
  body('groupId')
    .notEmpty().withMessage('Group is required')
    .isInt().withMessage('Group ID must be an integer'),
  body('defaultDuration')
    .optional()
    .isInt({ min: 0 }).withMessage('Default duration must be 0 or a positive integer')
];

exports.logActivityRules = [
  body('activityMasterId')
    .notEmpty().withMessage('Activity master is required')
    .isInt().withMessage('Activity Master ID must be an integer'),
  body('logDate')
    .notEmpty().withMessage('Log date is required')
    .isISO8601().withMessage('Log date must be a valid date'),
  body('session')
    .notEmpty().withMessage('Session block is required'),
  body('duration')
    .notEmpty().withMessage('Duration is required')
    .isInt({ min: 1 }).withMessage('Duration must be at least 1 minute')
];
