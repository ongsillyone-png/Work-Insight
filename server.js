const app = require('./app');
const appConfig = require('./config/app');
const logger = require('./utils/logger');

const server = app.listen(appConfig.port, () => {
  logger.info(`=================================================`);
  logger.info(` ${appConfig.name} Server Started Successfully `);
  logger.info(` Port: ${appConfig.port} | Mode: ${appConfig.env} `);
  logger.info(` URL: http://localhost:${appConfig.port} `);
  logger.info(`=================================================`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}\nStack: ${err.stack}`);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}\nReason: ${reason}`);
  server.close(() => {
    process.exit(1);
  });
});
