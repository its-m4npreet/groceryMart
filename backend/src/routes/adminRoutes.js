const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  updateStatus,
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
 * @desc    Export products to CSV with date filtering
 * @access  Private/Admin
 * @query   period=week|month|year|all (default: all)
 * @query   startDate, endDate (for custom range, ISO format)
 * @example /api/admin/export/products?period=month
 * @example /api/admin/export/products?startDate=2026-01-01&endDate=2026-01-31
 */
router.get("/export/products", exportProducts);

/**
 * @route   GET /api/admin/export/orders
 * @desc    Export orders to CSV with date filtering
 * @access  Private/Admin
 * @query   period=week|month|year|all (default: all)
 * @query   startDate, endDate (for custom range, ISO format)
 * @example /api/admin/export/orders?period=week
 * @example /api/admin/export/orders?startDate=2026-02-01&endDate=2026-02-28
 */
router.get("/export/orders", exportOrders);

/**
 * @route   GET /api/admin/export/users
 * @desc    Export users to CSV with date filtering
 * @access  Private/Admin
 * @query   period=week|month|year|all (default: all)
 * @query   startDate, endDate (for custom range, ISO format)
 * @example /api/admin/export/users?period=year
 * @example /api/admin/export/users?startDate=2025-01-01&endDate=2025-12-31
 */
router.get("/export/users", exportUsers);


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
