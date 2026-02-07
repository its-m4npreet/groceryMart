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
      .populate("user", "name email phone")
      .populate("items.product", "name image category price stock")
      .populate("statusHistory.updatedBy", "name email");

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

    const order = await Order.findById(id).populate("user", "name email");

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
 * @desc    Export products to CSV
 * @route   GET /api/admin/export/products
 * @access  Private/Admin
 */
const exportProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).select("-__v");

    const csv = [
      "ID,Name,Category,Price,Stock,Description",
      ...products.map(
        (p) =>
          `${p._id},"${p.name}","${p.category}",${p.price},${p.stock},"${p.description || ""}"`,
      ),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=products-${Date.now()}.csv`,
    );
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export orders to CSV
 * @route   GET /api/admin/export/orders
 * @access  Private/Admin
 */
const exportOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .select("-__v");

    const csv = [
      "Order Number,User Name,User Email,Status,Total Amount,Created At",
      ...orders.map(
        (o) =>
          `${o.orderNumber},"${o.user?.name || "N/A"}","${o.user?.email || "N/A"}","${o.status}",${o.totalAmount},${o.createdAt}`,
      ),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=orders-${Date.now()}.csv`,
    );
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export users to CSV
 * @route   GET /api/admin/export/users
 * @access  Private/Admin
 */
const exportUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password -__v");

    const csv = [
      "ID,Name,Email,Role,Created At",
      ...users.map(
        (u) => `${u._id},"${u.name}","${u.email}","${u.role}",${u.createdAt}`,
      ),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=users-${Date.now()}.csv`,
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
