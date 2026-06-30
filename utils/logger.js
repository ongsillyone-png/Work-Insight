const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const writeLog = (level, message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}]: ${message}\n`;
  
  // Write to console
  if (level === 'error') {
    console.error(logMessage.trim());
  } else {
    console.log(logMessage.trim());
  }

  // Write to log file
  const fileName = level === 'error' ? 'error.log' : 'combined.log';
  fs.appendFile(path.join(logDir, fileName), logMessage, (err) => {
    if (err) console.error('Failed to write to log file:', err);
  });
};

module.exports = {
  info: (msg) => writeLog('info', msg),
  warn: (msg) => writeLog('warn', msg),
  error: (msg) => writeLog('error', msg),
  debug: (msg) => writeLog('debug', msg)
};
