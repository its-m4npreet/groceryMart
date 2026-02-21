const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');
const { validateBody, validateParams, validateQuery } = require('../middleware/validate');
const { orderLimiter } = require('../middleware/rateLimiter');
const {
  createOrderSchema,
  updateOrderStatusSchema,
  orderQuerySchema,
  mongoIdParamSchema,
} = require('../utils/validationSchemas');

/**
 * @route   POST /api/orders
 * @desc    Create new order
 * @access  Private
 * @body    items (array of {product, quantity}), shippingAddress, paymentMethod, notes
 */
router.post(
  '/',
  protect,
  orderLimiter,
  validateBody(createOrderSchema),
  createOrder
);

/**
 * @route   GET /api/orders/my-orders
 * @desc    Get logged-in user's orders
 * @access  Private
 * @query   page, limit, status
 */
router.get('/my-orders', protect, getMyOrders);

/**
 * @route   GET /api/orders/stats
 * @desc    Get order statistics
 * @access  Private/Admin
 */
router.get('/stats', protect, adminOnly, getOrderStats);

/**
 * @route   GET /api/orders
 * @desc    Get all orders (Admin only)
 * @access  Private/Admin
 * @query   page, limit, status, startDate, endDate
 */
router.get('/', protect, adminOnly, getAllOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private (owner or admin)
 */
router.get(
  '/:id',
  protect,
  validateParams(mongoIdParamSchema),
  getOrderById
);

/**
 * @route   PATCH /api/orders/:id/status
 * @desc    Update order status
 * @access  Private/Admin
 * @body    status (confirmed/packed/shipped/delivered/cancelled), cancellationReason (optional)
 */
router.patch(
  '/:id/status',
  protect,
  adminOnly,
  validateParams(mongoIdParamSchema),
  validateBody(updateOrderStatusSchema),
  updateOrderStatus
);


/**
 * @route   PATCH /api/orders/:id/cancel
 * @desc    Cancel order (user can cancel own pending/confirmed orders)
 * @access  Private
 * @body    reason (optional)
 */
router.patch(
  '/:id/cancel',
  protect,
  validateParams(mongoIdParamSchema),
  cancelOrder
);

module.exports = router;
