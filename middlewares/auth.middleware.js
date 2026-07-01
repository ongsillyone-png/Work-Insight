const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const responseHelper = require('../helpers/response.helper');

module.exports = async (req, res, next) => {
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
    
    // Fetch latest preferences from DB to ensure it's up to date
    const userRepository = require('../repositories/user.repository');
    const dbUser = await userRepository.findById(decoded.id);
    if (dbUser) {
      req.user.preferred_categories = dbUser.preferred_categories;
      res.locals.user.preferred_categories = dbUser.preferred_categories;
      req.user.quick_actions = dbUser.quick_actions;
      res.locals.user.quick_actions = dbUser.quick_actions;
    }
    
    // Globally provide categories to all views for the settings modal
    const categoryService = require('../services/category.service');
    res.locals.allCategories = await categoryService.getAllCategories();
    
    next();
  } catch (err) {
    if (req.xhr || req.headers.accept?.includes('json') || req.path.startsWith('/api/')) {
      return responseHelper.error(res, 'Invalid token or session expired', 401);
    }
    res.clearCookie('token');
    return res.redirect('/auth/login');
  }
};
