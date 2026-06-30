const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const responseHelper = require('../helpers/response.helper');

module.exports = (req, res, next) => {
  // Check both cookies (for EJS views) and headers (for API requests)
  let token = req.cookies?.token || '';

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    if (req.xhr || req.headers.accept?.includes('json') || req.path.startsWith('/api/')) {
      return responseHelper.error(res, 'Unauthenticated', 401);
    }
    return res.redirect('/auth/login');
  }

  try {
    const decoded = jwt.verify(token, authConfig.jwtSecret);
    req.user = decoded;
    res.locals.user = decoded; // Make user details available to views automatically
    next();
  } catch (err) {
    if (req.xhr || req.headers.accept?.includes('json') || req.path.startsWith('/api/')) {
      return responseHelper.error(res, 'Invalid token or session expired', 401);
    }
    res.clearCookie('token');
    return res.redirect('/auth/login');
  }
};
