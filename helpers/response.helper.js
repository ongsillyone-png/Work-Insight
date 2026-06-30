const { RESPONSE_STATUS } = require('../utils/constants');

/**
 * Send JSON success response
 */
const success = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    status: RESPONSE_STATUS.SUCCESS,
    message,
    data
  });
};

/**
 * Send JSON error response
 */
const error = (res, message = 'Internal Server Error', statusCode = 500, details = null) => {
  return res.status(statusCode).json({
    status: RESPONSE_STATUS.ERROR,
    message,
    details
  });
};

/**
 * Send validation error response
 */
const validationError = (res, errors, message = 'Validation Failed', statusCode = 422) => {
  return res.status(statusCode).json({
    status: RESPONSE_STATUS.FAIL,
    message,
    errors
  });
};

module.exports = {
  success,
  error,
  validationError
};
