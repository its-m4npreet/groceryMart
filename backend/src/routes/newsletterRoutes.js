const express = require('express');
const router = express.Router();
const {
  subscribe,
  unsubscribe,
  getSubscribers,
} = require('../controllers/newsletterController');
const { protect, adminOnly } = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');
const { newsletterSubscribeSchema } = require('../utils/validationSchemas');

// Public routes
router.post('/subscribe', validateBody(newsletterSubscribeSchema), subscribe);
router.post('/unsubscribe', validateBody(newsletterSubscribeSchema), unsubscribe);

// Admin routes
router.get('/subscribers', protect, adminOnly, getSubscribers);

module.exports = router;
