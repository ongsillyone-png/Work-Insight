const authService = require('../services/auth.service');
const { validationResult } = require('express-validator');

class AuthController {
  /**
   * Render login page
   */
  async renderLogin(req, res) {
    if (req.cookies?.token) {
      return res.redirect('/home');
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

      const { username, password, remember_me } = req.body;
      const isRememberMe = remember_me === 'on' || remember_me === true;
      console.log(`[LOGIN ATTEMPT] Username: "${username}", Remember Me: ${isRememberMe}`);
      
      const result = await authService.login(username, password, isRememberMe);

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.USE_HTTPS === 'true' // Only set to true if running over HTTPS
      };

      if (isRememberMe) {
        cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
      }

      // Set cookie
      res.cookie('token', result.token, cookieOptions);

      return res.redirect('/home');
    } catch (err) {
      console.error("[LOGIN ERROR]:", err.message);
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
