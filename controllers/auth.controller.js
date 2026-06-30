const authService = require('../services/auth.service');
const { validationResult } = require('express-validator');

class AuthController {
  /**
   * Render login page
   */
  async renderLogin(req, res) {
    if (req.cookies?.token) {
      return res.redirect('/dashboard');
    }
    return res.render('auth/login', { title: 'Login | Work Insight', error: null });
  }

  /**
   * Handle login submission
   */
  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render('auth/login', {
          title: 'Login | Work Insight',
          error: errors.array()[0].msg
        });
      }

      const { username, password } = req.body;
      const result = await authService.login(username, password);

      // Set cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      return res.redirect('/dashboard');
    } catch (err) {
      return res.render('auth/login', {
        title: 'Login | Work Insight',
        error: 'Invalid username or password'
      });
    }
  }

  /**
   * Handle logout
   */
  async logout(req, res) {
    res.clearCookie('token');
    return res.redirect('/auth/login');
  }
}

module.exports = new AuthController();
