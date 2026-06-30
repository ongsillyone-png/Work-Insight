require('dotenv').config();

module.exports = {
  name: process.env.APP_NAME || 'Work Insight',
  port: parseInt(process.env.PORT, 10) || 3000,
  env: process.env.NODE_ENV || 'development',
  uploadPath: process.env.UPLOAD_PATH || 'public/uploads',
  isProduction: process.env.NODE_ENV === 'production'
};
