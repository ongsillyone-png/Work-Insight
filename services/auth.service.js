const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const authRepository = require('../repositories/auth.repository');

class AuthService {
  /**
   * Authenticate a user by username and password
   * @param {string} username 
   * @param {string} password 
   */
  async login(username, password, rememberMe = false) {
    const user = await authRepository.findByUsername(username);
    console.log(`[AUTH SERVICE] Found user in DB:`, user ? user.username : 'NULL');
    if (!user) {
      throw new Error('Invalid username or password');
    }

    console.log(`[AUTH SERVICE] Comparing password against hash:`, user.password_hash);
    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log(`[AUTH SERVICE] isMatch:`, isMatch);
    if (!isMatch) {
      throw new Error('Invalid username or password');
    }

    const payload = {
      id: Number(user.id),
      username: user.username,
      fullName: user.full_name,
      role: user.role
    };

    const expiresIn = rememberMe ? '30d' : authConfig.jwtExpiresIn;
    const token = jwt.sign(payload, authConfig.jwtSecret, { expiresIn });

    return { token, user: payload };
  }

  async verifyToken(token) {
    return jwt.verify(token, authConfig.jwtSecret);
  }
}

module.exports = new AuthService();
