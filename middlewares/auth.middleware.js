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
      req.user.managed_categories = dbUser.managed_categories;
      res.locals.user.managed_categories = dbUser.managed_categories;
      req.user.quick_actions = dbUser.quick_actions;
      res.locals.user.quick_actions = dbUser.quick_actions;
      req.user.role_id = dbUser.role_id; // ensure role_id is present
    }
    
    // Globally provide categories to all views for the settings modal
    const categoryService = require('../services/category.service');
    let allCategories = await categoryService.getAllCategories();
    
    if (req.user.role_id !== 1) { // 1 is Admin
      if (req.user.managed_categories) {
        const managedIds = req.user.managed_categories.split(',').map(id => id.trim());
        allCategories = allCategories.filter(c => managedIds.includes(c.id.toString()));
      } else {
        allCategories = [];
      }
    }
    res.locals.allCategories = allCategories;
    
    next();
  } catch (err) {
    if (req.xhr || req.headers.accept?.includes('json') || req.path.startsWith('/api/')) {
      return responseHelper.error(res, 'Invalid token or session expired', 401);
    }
    res.clearCookie('token');
    return res.redirect('/auth/login');
  }
};
