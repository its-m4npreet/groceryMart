const Newsletter = require('../models/newsletterModel');
const { successResponse, errorResponse } = require('../utils/helpers');

/**
 * @desc    Subscribe to newsletter
 * @route   POST /api/newsletter/subscribe
 * @access  Public
 */
const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if email already subscribed
    const existingSubscription = await Newsletter.findOne({ email: email.toLowerCase() });
    
    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return errorResponse(res, 'This email is already subscribed to our newsletter', 400);
      } else {
        // Reactivate subscription
        existingSubscription.isActive = true;
        existingSubscription.subscribedAt = Date.now();
        await existingSubscription.save();
        return successResponse(res, 'Welcome back! Your subscription has been reactivated', existingSubscription);
      }
    }

    // Create new subscription
    const subscription = await Newsletter.create({ email: email.toLowerCase() });

    return successResponse(
      res,
      'Successfully subscribed to newsletter! You will receive exclusive deals and updates.',
      subscription,
      null,
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Unsubscribe from newsletter
 * @route   POST /api/newsletter/unsubscribe
 * @access  Public
 */
const unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    const subscription = await Newsletter.findOne({ email: email.toLowerCase() });

    if (!subscription) {
      return errorResponse(res, 'Email not found in our newsletter list', 404);
    }

    subscription.isActive = false;
    await subscription.save();

    return successResponse(res, 'Successfully unsubscribed from newsletter', null);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all newsletter subscribers (Admin only)
 * @route   GET /api/newsletter/subscribers
 * @access  Private/Admin
 */
const getSubscribers = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, active = 'true' } = req.query;

    const filter = active === 'true' ? { isActive: true } : {};
    
    const total = await Newsletter.countDocuments(filter);
    
    const subscribers = await Newsletter.find(filter)
      .sort({ subscribedAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .select('-__v');

    const meta = {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    };

    return successResponse(res, 'Subscribers retrieved successfully', subscribers, meta);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  subscribe,
  unsubscribe,
  getSubscribers,
};
