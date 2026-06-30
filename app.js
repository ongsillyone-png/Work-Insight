const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const routes = require('./routes/index.routes');
const errorMiddleware = require('./middlewares/error.middleware');
const logger = require('./utils/logger');

const app = express();

// Set View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.js"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://cdn.jsdelivr.net", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://cdn.jsdelivr.net"]
    }
  }
}));
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Performance / Utility Middlewares
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve Static Assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Application Routes
app.use('/', routes);

// 404 Handler
app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

// Centralized Global Error Handler Middleware
app.use(errorMiddleware);

module.exports = app;
