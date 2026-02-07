const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  updateStatus,
  getDashboard,
  getBestSelling,
  getLowStock,
  getOrderSummary,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');
const { validateBody, validateParams } = require('../middleware/validate');
const { mongoIdParamSchema, updateOrderStatusSchema } = require('../utils/validationSchemas');

// All routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

/**
 * ============================================
 * ORDER MANAGEMENT ROUTES
 * ============================================
 */

/**
 * @route   GET /api/admin/orders
 * @desc    Get all orders with filters
 * @access  Private/Admin
 * @query   page, limit, status, userId, startDate, endDate, minAmount, maxAmount, sortBy, sortOrder
 */
router.get('/orders', getAllOrders);

/**
 * @route   GET /api/admin/orders/:id
 * @desc    Get single order details
 * @access  Private/Admin
 */
router.get('/orders/:id', validateParams(mongoIdParamSchema), getOrderById);

/**
 * @route   PUT /api/admin/orders/:id/status
 * @desc    Update order status with strict flow enforcement
 * @access  Private/Admin
 * @body    { status: 'confirmed'|'packed'|'shipped'|'delivered'|'cancelled', reason?: string }
 * 
 * Status Flow:
 * pending → confirmed → packed → shipped → delivered
 * Cancellation allowed from: pending, confirmed, packed
 */
router.put(
  '/orders/:id/status',
  validateParams(mongoIdParamSchema),
  validateBody(updateOrderStatusSchema),
  updateStatus
);

/**
 * ============================================
 * ANALYTICS ROUTES
 * ============================================
 */

/**
 * @route   GET /api/admin/analytics/dashboard
 * @desc    Get comprehensive dashboard analytics
 * @access  Private/Admin
 * @query   days (default: 30)
 */
router.get('/analytics/dashboard', getDashboard);

/**
 * @route   GET /api/admin/analytics/summary
 * @desc    Get quick summary stats (today, week, month)
 * @access  Private/Admin
 */
router.get('/analytics/summary', getOrderSummary);

/**
 * @route   GET /api/admin/analytics/best-selling
 * @desc    Get best selling products
 * @access  Private/Admin
 * @query   limit (default: 10), days (optional)
 */
router.get('/analytics/best-selling', getBestSelling);

/**
 * @route   GET /api/admin/analytics/low-stock
 * @desc    Get products with low stock
 * @access  Private/Admin
 * @query   threshold (default: 10)
 */
router.get('/analytics/low-stock', getLowStock);

module.exports = router;
