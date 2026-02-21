const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  updateStatus,
  assignRiderToOrder,
  getDashboard,
  getBestSelling,
  getLowStock,
  getOrderSummary,
  bulkPriceUpdate,
  bulkStockUpdate,
  deleteOutOfStock,
  exportProducts,
  exportOrders,
  exportUsers,
  clearCache,
  cleanupDatabase,
  getAllRiders,
  getRiderById,
  toggleRiderStatus,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");
const { validateBody, validateParams } = require("../middleware/validate");
const {
  mongoIdParamSchema,
  updateOrderStatusSchema,
  bulkPriceUpdateSchema,
  bulkStockUpdateSchema,
} = require("../utils/validationSchemas");

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
router.get("/orders", getAllOrders);

/**
 * @route   GET /api/admin/orders/:id
 * @desc    Get single order details
 * @access  Private/Admin
 */
router.get("/orders/:id", validateParams(mongoIdParamSchema), getOrderById);

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
  "/orders/:id/status",
  validateParams(mongoIdParamSchema),
  validateBody(updateOrderStatusSchema),
  updateStatus,
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
router.get("/analytics/dashboard", getDashboard);

/**
 * @route   GET /api/admin/analytics/summary
 * @desc    Get quick summary stats (today, week, month)
 * @access  Private/Admin
 */
router.get("/analytics/summary", getOrderSummary);

/**
 * @route   GET /api/admin/analytics/best-selling
 * @desc    Get best selling products
 * @access  Private/Admin
 * @query   limit (default: 10), days (optional)
 */
router.get("/analytics/best-selling", getBestSelling);

/**
 * @route   GET /api/admin/analytics/low-stock
 * @desc    Get products with low stock
 * @access  Private/Admin
 * @query   threshold (default: 10)
 */
router.get("/analytics/low-stock", getLowStock);

/**
 * ============================================
 * BULK PRODUCT OPERATIONS
 * ============================================
 */

/**
 * @route   PATCH /api/admin/products/bulk-price
 * @desc    Bulk update product prices
 * @access  Private/Admin
 * @body    { percentage: number, action: 'increase'|'decrease' }
 */
router.patch(
  "/products/bulk-price",
  validateBody(bulkPriceUpdateSchema),
  bulkPriceUpdate,
);

/**
 * @route   PATCH /api/admin/products/bulk-stock
 * @desc    Bulk update product stock
 * @access  Private/Admin
 * @body    { quantity: number, action: 'add'|'subtract'|'set' }
 */
router.patch(
  "/products/bulk-stock",
  validateBody(bulkStockUpdateSchema),
  bulkStockUpdate,
);

/**
 * @route   DELETE /api/admin/products/out-of-stock
 * @desc    Delete all out of stock products
 * @access  Private/Admin
 */
router.delete("/products/out-of-stock", deleteOutOfStock);

/**
 * ============================================
 * DATA EXPORT ROUTES
 * ============================================
 */

/**
 * @route   GET /api/admin/export/products
 * @desc    Export all products to CSV
 * @access  Private/Admin
 */
router.get("/export/products", exportProducts);

/**
 * @route   GET /api/admin/export/orders
 * @desc    Export all orders to CSV
 * @access  Private/Admin
 */
router.get("/export/orders", exportOrders);

/**
 * @route   GET /api/admin/export/users
 * @desc    Export all users to CSV
 * @access  Private/Admin
 */
router.get("/export/users", exportUsers);

/**
 * ============================================
 * RIDER MANAGEMENT ROUTES
 * ============================================
 */

/**
 * @route   GET /api/admin/riders
 * @desc    Get all riders with delivery statistics
 * @access  Private/Admin
 * @query   page, limit, status (all|active|inactive)
 */
router.get("/riders", getAllRiders);

/**
 * @route   GET /api/admin/riders/:id
 * @desc    Get detailed rider information
 * @access  Private/Admin
 */
router.get("/riders/:id", validateParams(mongoIdParamSchema), getRiderById);

/**
 * @route   PATCH /api/admin/riders/:id/toggle-status
 * @desc    Activate or deactivate a rider
 * @access  Private/Admin
 */
router.patch(
  "/riders/:id/toggle-status",
  validateParams(mongoIdParamSchema),
  toggleRiderStatus
);

/**
 * @route   PATCH /api/admin/orders/:id/assign-rider
 * @desc    Assign an active rider to deliver an order
 * @access  Private/Admin
 * @body    { riderId: string }
 */
router.patch(
  "/orders/:id/assign-rider",
  validateParams(mongoIdParamSchema),
  assignRiderToOrder
);

/**
 * ============================================
 * SYSTEM MAINTENANCE ROUTES
 * ============================================
 */

/**
 * @route   POST /api/admin/system/clear-cache
 * @desc    Clear application cache
 * @access  Private/Admin
 */
router.post("/system/clear-cache", clearCache);

/**
 * @route   POST /api/admin/system/cleanup-db
 * @desc    Cleanup database (remove orphaned data)
 * @access  Private/Admin
 */
router.post("/system/cleanup-db", cleanupDatabase);

module.exports = router;
