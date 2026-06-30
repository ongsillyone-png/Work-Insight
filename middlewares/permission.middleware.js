const responseHelper = require('../helpers/response.helper');

/**
 * Middleware to restrict access based on user role names
 * @param {Array<string>} allowedRoles
 */
module.exports = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      if (req.xhr || req.headers.accept?.includes('json') || req.path.startsWith('/api/')) {
        return responseHelper.error(res, 'Forbidden: Role not assigned', 403);
      }
      return res.status(403).render('errors/403', { layout: false });
    }

    if (!allowedRoles.includes(req.user.role)) {
      if (req.xhr || req.headers.accept?.includes('json') || req.path.startsWith('/api/')) {
        return responseHelper.error(res, 'Forbidden: Insufficient privileges', 403);
      }
      return res.status(403).render('errors/403', { layout: false });
    }

    next();
  };
};
