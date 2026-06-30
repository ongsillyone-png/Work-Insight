require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'super_secret_key_change_me_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  bcryptSaltRounds: 10
};
