const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * @desc    Verify JWT token and attach user to request
 * @usage   Use on all protected routes
 */
const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (excluding password)
    req.user = await User.findById(decoded.user.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user not found',
      });
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired, please login again',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Not authorized',
    });
  }
};

/**
 * @desc    Restrict access to admin users only
 * @usage   Use after protect middleware on admin-only routes
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required',
    });
  }
};


/**
 * @desc    Restrict access to specific roles
 * @param   {...String} roles - Allowed roles
 * @usage   Use after protect middleware
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route`,
      });
    }


    next();
  };
};

module.exports = {
  protect,
  adminOnly,
  adminOnly,
  authorize,
};
