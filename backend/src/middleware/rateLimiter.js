const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter
 * Limits requests to 100 per 15 minutes per IP
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again after 15 minutes',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Auth routes rate limiter (stricter)
 * Limits auth requests to 5 per 15 minutes per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

/**
 * Order creation rate limiter
 * Limits order creation to 10 per hour per IP
 */
const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 orders per hour
  message: {
    success: false,
    message: 'Too many orders placed, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * File upload rate limiter
 * Limits uploads to 20 per hour per IP
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 uploads per hour
  message: {
    success: false,
    message: 'Too many file uploads, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  authLimiter,
  orderLimiter,
  uploadLimiter,
};
