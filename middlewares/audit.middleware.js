const logger = require('../utils/logger');

/**
 * Middleware boilerplate to log audited actions
 * @param {string} actionName
 */
module.exports = (actionName) => {
  return (req, res, next) => {
    const userId = req.user ? req.user.id : 'anonymous';
    const username = req.user ? req.user.username : 'guest';
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    // Log audit activity
    logger.info(`Audit Log - User ID: ${userId} (${username}) | Action: ${actionName} | Route: ${req.originalUrl} | IP: ${ip} | User Agent: ${userAgent}`);
    
    // In future phases, this can call auditRepository.create(...)
    next();
  };
};
