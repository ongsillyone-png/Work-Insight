const logger = require('../utils/logger');
const responseHelper = require('../helpers/response.helper');

module.exports = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error
  logger.error(`${req.method} ${req.originalUrl} - Status ${statusCode} - ${message}\nStack: ${err.stack}`);

  // Determine if client expects JSON or HTML view
  if (req.xhr || req.headers.accept?.includes('json') || req.path.startsWith('/api/')) {
    return responseHelper.error(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : null);
  }

  // Render view error
  res.status(statusCode);
  return res.render('errors/error', {
    layout: false, // Don't use normal layout for error page to avoid sidebar dependencies breaking
    statusCode,
    message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};
