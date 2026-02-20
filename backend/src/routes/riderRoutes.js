const express = require('express');
const router = express.Router();
const {
  getMyAssignedOrders,
  getAssignedOrderById,
  updateDeliveryStatus,
  getRiderStats,
} = require('../controllers/riderController');
const { protect, authorize } = require('../middleware/auth');
const { validateParams, validateBody } = require('../middleware/validate');
const { mongoIdParamSchema } = require('../utils/validationSchemas');

/**
 * @desc    Protect all rider routes - only accessible by riders
 */
router.use(protect, authorize('rider'));

/**
 * @route   GET /api/rider/stats
 * @desc    Get rider dashboard statistics
 * @access  Private/Rider
 */
router.get('/stats', getRiderStats);

/**
 * @route   GET /api/rider/orders
 * @desc    Get orders assigned to logged-in rider
 * @access  Private/Rider
 * @query   page, limit, deliveryStatus
 */
router.get('/orders', getMyAssignedOrders);

/**
 * @route   GET /api/rider/orders/:id
 * @desc    Get single order details (only if assigned to rider)
 * @access  Private/Rider
 */
router.get(
  '/orders/:id',
  validateParams(mongoIdParamSchema),
  getAssignedOrderById
);

/**
 * @route   PATCH /api/rider/orders/:id/delivery-status
 * @desc    Update delivery status (out_for_delivery, delivered)
 * @access  Private/Rider
 * @body    deliveryStatus (out_for_delivery | delivered)
 */
router.patch(
  '/orders/:id/delivery-status',
  validateParams(mongoIdParamSchema),
  validateBody({
    deliveryStatus: {
      in: ['body'],
      isIn: {
        options: [['out_for_delivery', 'delivered']],
        errorMessage: 'Invalid delivery status',
      },
    },
  }),
  updateDeliveryStatus
);

module.exports = router;
