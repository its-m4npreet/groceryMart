const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const {
  validateStatusTransition,
  updateOrderStatus,
  getOrdersForAdmin,
} = require("../services/orderService");
const {
  restoreStock,
  getLowStockProducts,
} = require("../services/stockService");
const {
  getDashboardAnalytics,
  getBestSellingProducts,
} = require("../services/analyticsService");
const {
  successResponse,
  errorResponse,
  getPaginationMeta,
} = require("../utils/helpers");
const { getIO } = require("../sockets");

/**
 * @desc    Get all orders for admin with filters
 * @route   GET /api/admin/orders
 * @access  Private/Admin
 */
const getAllOrders = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      userId,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const result = await getOrdersForAdmin(
      { status, userId, startDate, endDate, minAmount, maxAmount },
      { page: Number(page), limit: Number(limit), sortBy, sortOrder },
    );

    const meta = getPaginationMeta(result.page, result.limit, result.total);

    return successResponse(
      res,
      "Orders retrieved successfully",
      result.orders,
      meta,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single order details for admin
 * @route   GET /api/admin/orders/:id
 * @access  Private/Admin
 */
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("user", "name phone")
      .populate("items.product", "name image category price stock")
      .populate("statusHistory.updatedBy", "name");

    if (!order) {
      return errorResponse(res, "Order not found", 404);
    }

    return successResponse(res, "Order retrieved successfully", order);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status (strict flow enforcement)
 * @route   PUT /api/admin/orders/:id/status
 * @access  Private/Admin
 *
 * Status Flow: pending → confirmed → packed → shipped → delivered
 * Cancellation allowed from: pending, confirmed, packed
 */
const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const adminId = req.user._id;

    const order = await Order.findById(id).populate("user", "name");

    if (!order) {
      return errorResponse(res, "Order not found", 404);
    }

    // Validate status transition (admin can change to any status)
    const validation = validateStatusTransition(order.status, status, true);
    if (!validation.valid) {
      return errorResponse(res, validation.message, 400);
    }

    // Handle cancellation - restore stock
    if (status === "cancelled") {
      const { updatedProducts } = await restoreStock(order.items);

      // Emit stock updates
      const io = getIO();
      if (io) {
        for (const product of updatedProducts) {
          io.emit("product-updated", {
            type: "stock",
            productId: product.productId,
            name: product.name,
            oldStock: product.oldStock,
            newStock: product.newStock,
            message: `Stock restored for ${product.name}`,
          });
        }
      }
    }

    // Update order status (this also emits socket events)
    const updatedOrder = await updateOrderStatus(
      order,
      status,
      adminId,
      reason,
      true, // Admin can change to any status
    );

    // Populate for response
    await updatedOrder.populate("statusHistory.updatedBy", "name");

    return successResponse(
      res,
      `Order status updated to ${status}`,
      updatedOrder,
    );
  } catch (error) {
    if (error.message.includes("Invalid status transition")) {
      return errorResponse(res, error.message, 400);
    }
    next(error);
  }
};

/**
 * @desc    Get dashboard analytics
 * @route   GET /api/admin/analytics/dashboard
 * @access  Private/Admin
 */
const getDashboard = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;

    const analytics = await getDashboardAnalytics(Number(days));

    return successResponse(
      res,
      "Dashboard analytics retrieved successfully",
      analytics,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get best selling products
 * @route   GET /api/admin/analytics/best-selling
 * @access  Private/Admin
 */
const getBestSelling = async (req, res, next) => {
  try {
    const { limit = 10, days } = req.query;

    let startDate = null;
    let endDate = null;

    if (days) {
      endDate = new Date();
      startDate = new Date();
      startDate.setDate(startDate.getDate() - Number(days));
    }

    const products = await getBestSellingProducts(
      Number(limit),
      startDate,
      endDate,
    );

    return successResponse(
      res,
      "Best selling products retrieved successfully",
      products,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get low stock alerts
 * @route   GET /api/admin/analytics/low-stock
 * @access  Private/Admin
 */
const getLowStock = async (req, res, next) => {
  try {
    const { threshold = 10 } = req.query;

    const products = await getLowStockProducts(Number(threshold));

    return successResponse(res, "Low stock products retrieved successfully", {
      threshold: Number(threshold),
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order statistics summary
 * @route   GET /api/admin/analytics/summary
 * @access  Private/Admin
 */
const getOrderSummary = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    // Run all queries in parallel
    const [
      todayOrders,
      weekOrders,
      monthOrders,
      pendingOrders,
      processingOrders,
      totalProducts,
      lowStockCount,
    ] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: todayStart } }),
      Order.countDocuments({ createdAt: { $gte: weekStart } }),
      Order.countDocuments({ createdAt: { $gte: monthStart } }),
      Order.countDocuments({ status: "pending" }),
      Order.countDocuments({
        status: { $in: ["confirmed", "packed", "shipped"] },
      }),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ stock: { $lte: 10 }, isActive: true }),
    ]);

    // Revenue calculations
    const [todayRevenue, weekRevenue, monthRevenue] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: todayStart },
            status: { $ne: "cancelled" },
          },
        },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: weekStart },
            status: { $ne: "cancelled" },
          },
        },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: monthStart },
            status: { $ne: "cancelled" },
          },
        },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
    ]);

    return successResponse(res, "Order summary retrieved successfully", {
      orders: {
        today: todayOrders,
        thisWeek: weekOrders,
        thisMonth: monthOrders,
        pending: pendingOrders,
        processing: processingOrders,
      },
      revenue: {
        today: todayRevenue[0]?.total || 0,
        thisWeek: weekRevenue[0]?.total || 0,
        thisMonth: monthRevenue[0]?.total || 0,
      },
      products: {
        total: totalProducts,
        lowStock: lowStockCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Bulk update product prices
 * @route   PATCH /api/admin/products/bulk-price
 * @access  Private/Admin
 */
const bulkPriceUpdate = async (req, res, next) => {
  try {
    const { percentage, action } = req.body;

    const products = await Product.find({});
    const updatePromises = products.map(async (product) => {
      let newPrice = product.price;
      if (action === "increase") {
        newPrice = product.price * (1 + percentage / 100);
      } else if (action === "decrease") {
        newPrice = product.price * (1 - percentage / 100);
      }
      product.price = Math.round(newPrice * 100) / 100;
      return product.save();
    });

    await Promise.all(updatePromises);

    return successResponse(res, "Bulk price update completed", {
      modifiedCount: products.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Bulk update product stock
 * @route   PATCH /api/admin/products/bulk-stock
 * @access  Private/Admin
 */
const bulkStockUpdate = async (req, res, next) => {
  try {
    const { quantity, action } = req.body;

    const products = await Product.find({});
    const updatePromises = products.map(async (product) => {
      let newStock = product.stock;
      if (action === "add") {
        newStock = product.stock + quantity;
      } else if (action === "subtract") {
        newStock = Math.max(0, product.stock - quantity);
      } else if (action === "set") {
        newStock = quantity;
      }
      product.stock = newStock;
      return product.save();
    });

    await Promise.all(updatePromises);

    return successResponse(res, "Bulk stock update completed", {
      modifiedCount: products.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete all out of stock products
 * @route   DELETE /api/admin/products/out-of-stock
 * @access  Private/Admin
 */
const deleteOutOfStock = async (req, res, next) => {
  try {
    const result = await Product.deleteMany({ stock: 0 });

    return successResponse(res, "Out of stock products deleted", {
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export products to CSV with date filtering
 * @route   GET /api/admin/export/products
 * @access  Private/Admin
 * @query   period (week|month|year|all), startDate, endDate
 */
const exportProducts = async (req, res, next) => {
  try {
    const { period = 'all', startDate, endDate } = req.query;

    // Build date filter
    const filter = {};
    const now = new Date();
    let periodLabel = 'all';

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
      periodLabel = 'custom';
    } else if (period !== 'all') {
      const dateFilter = {};
      switch (period) {
        case 'week':
          dateFilter.$gte = new Date(now.setDate(now.getDate() - 7));
          periodLabel = 'last-week';
          break;
        case 'month':
          dateFilter.$gte = new Date(now.setMonth(now.getMonth() - 1));
          periodLabel = 'last-month';
          break;
        case 'year':
          dateFilter.$gte = new Date(now.setFullYear(now.getFullYear() - 1));
          periodLabel = 'last-year';
          break;
      }
      if (Object.keys(dateFilter).length > 0) {
        filter.createdAt = dateFilter;
      }
    }

    const products = await Product.find(filter).select("-__v");

    const csv = [
      "ID,Name,Category,Price,Stock,Description,Created At",
      ...products.map(
        (p) =>
          `${p._id},"${p.name}","${p.category}",${p.price},${p.stock},"${p.description || ""}",${p.createdAt}`,
      ),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=products-${periodLabel}-${Date.now()}.csv`,
    );
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export orders to CSV with date filtering
 * @route   GET /api/admin/export/orders
 * @access  Private/Admin
 * @query   period (week|month|year|all), startDate, endDate
 */
const exportOrders = async (req, res, next) => {
  try {
    const { period = 'all', startDate, endDate } = req.query;

    // Build date filter
    const filter = {};
    const now = new Date();
    let periodLabel = 'all';

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
      periodLabel = 'custom';
    } else if (period !== 'all') {
      const dateFilter = {};
      switch (period) {
        case 'week':
          dateFilter.$gte = new Date(now.setDate(now.getDate() - 7));
          periodLabel = 'last-week';
          break;
        case 'month':
          dateFilter.$gte = new Date(now.setMonth(now.getMonth() - 1));
          periodLabel = 'last-month';
          break;
        case 'year':
          dateFilter.$gte = new Date(now.setFullYear(now.getFullYear() - 1));
          periodLabel = 'last-year';
          break;
      }
      if (Object.keys(dateFilter).length > 0) {
        filter.createdAt = dateFilter;
      }
    }

    const orders = await Order.find(filter)
      .populate("user", "name")
      .select("-__v");

    const csv = [
      "Order Number,User ID,User Name,Status,Total Amount,Created At",
      ...orders.map(
        (o) =>
          `${o.orderNumber},${o.user?._id || "N/A"},"${o.user?.name || "N/A"}","${o.status}",${o.totalAmount},${o.createdAt}`,
      ),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=orders-${periodLabel}-${Date.now()}.csv`,
    );
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export users to CSV with date filtering
 * @route   GET /api/admin/export/users
 * @access  Private/Admin
 * @query   period (week|month|year|all), startDate, endDate
 */
const exportUsers = async (req, res, next) => {
  try {
    const { period = 'all', startDate, endDate } = req.query;

    // Build date filter
    const filter = {};
    const now = new Date();
    let periodLabel = 'all';

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
      periodLabel = 'custom';
    } else if (period !== 'all') {
      const dateFilter = {};
      switch (period) {
        case 'week':
          dateFilter.$gte = new Date(now.setDate(now.getDate() - 7));
          periodLabel = 'last-week';
          break;
        case 'month':
          dateFilter.$gte = new Date(now.setMonth(now.getMonth() - 1));
          periodLabel = 'last-month';
          break;
        case 'year':
          dateFilter.$gte = new Date(now.setFullYear(now.getFullYear() - 1));
          periodLabel = 'last-year';
          break;
      }
      if (Object.keys(dateFilter).length > 0) {
        filter.createdAt = dateFilter;
      }
    }

    const users = await User.find(filter).select("-password -email -__v");

    // Get order counts for filtered users
    const userIds = users.map(u => u._id);
    const orderCounts = await Order.aggregate([
      { $match: { user: { $in: userIds } } },
      { $group: { _id: "$user", count: { $sum: 1 } } }
    ]);
    
    // Create a map of user ID to order count
    const orderCountMap = {};
    orderCounts.forEach(item => {
      orderCountMap[item._id] = item.count;
    });

    const csv = [
      "User ID,Name,Role,Total Orders,Created At",
      ...users.map(
        (u) => `${u._id},"${u.name}","${u.role}",${orderCountMap[u._id] || 0},${u.createdAt}`,
      ),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=users-${periodLabel}-${Date.now()}.csv`,
    );
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear application cache
 * @route   POST /api/admin/system/clear-cache
 * @access  Private/Admin
 */
const clearCache = async (req, res, next) => {
  try {
    // Implement actual cache clearing logic based on your caching strategy
    // For now, just return success
    return successResponse(res, "Cache cleared successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Database cleanup
 * @route   POST /api/admin/system/cleanup-db
 * @access  Private/Admin
 */
const cleanupDatabase = async (req, res, next) => {
  try {
    // Remove old session data, logs, or orphaned records
    // This is a placeholder - implement actual cleanup logic
    return successResponse(res, "Database cleanup completed");
  } catch (error) {
    next(error);
  }
};


module.exports = {
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
};
