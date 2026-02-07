const { z } = require('zod');

/**
 * Middleware factory to validate request body against a Zod schema
 * @param {ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
const validateBody = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    
    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }
    
    req.body = result.data; // Replace body with validated/transformed data
    next();
  };
};

/**
 * Middleware factory to validate request query params against a Zod schema
 * @param {ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    
    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors,
      });
    }
    
    req.query = result.data;
    next();
  };
};

/**
 * Middleware factory to validate request params against a Zod schema
 * @param {ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.params);
    
    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Invalid URL parameters',
        errors,
      });
    }
    
    req.params = result.data;
    next();
  };
};

module.exports = {
  validateBody,
  validateQuery,
  validateParams,
};
