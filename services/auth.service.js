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
  async login(username, password) {
    // Boilerplate for validation.
    // In future phases, this will verify password_hash using bcrypt.compare
    
    // For now, return a mockup token for mock testing
    const mockUser = {
      id: 1,
      username: username || 'admin',
      fullName: 'Mock Admin User',
      role: 'Admin'
    };

    const token = jwt.sign(mockUser, authConfig.jwtSecret, {
      expiresIn: authConfig.jwtExpiresIn
    });

    return { token, user: mockUser };
  }

  async verifyToken(token) {
    return jwt.verify(token, authConfig.jwtSecret);
  }
}

module.exports = new AuthService();
