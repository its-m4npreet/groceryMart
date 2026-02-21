const Order = require("../models/orderModel");
const Product = require("../models/productModel");

/**
 * Get daily orders count for a date range
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Array} Daily order counts
 */
const getDailyOrdersCount = async (startDate, endDate) => {
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        count: { $sum: 1 },
        revenue: { $sum: "$totalAmount" },
        cancelled: {
          $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
        },
        delivered: {
          $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: {
          $dateFromParts: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
          },
        },
        count: 1,
        revenue: 1,
        cancelled: 1,
        delivered: 1,
      },
    },
    { $sort: { date: 1 } },
  ]);

  return result;
};

/**
 * Get daily revenue for a date range
 * Excludes cancelled orders
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Array} Daily revenue data
 */
const getDailyRevenue = async (startDate, endDate) => {
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
        status: { $ne: "cancelled" },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        revenue: { $sum: "$totalAmount" },
        orderCount: { $sum: 1 },
        avgOrderValue: { $avg: "$totalAmount" },
      },
    },
    {
      $project: {
        _id: 0,
        date: {
          $dateFromParts: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
          },
        },
        revenue: { $round: ["$revenue", 2] },
        orderCount: 1,
        avgOrderValue: { $round: ["$avgOrderValue", 2] },
      },
    },
    { $sort: { date: 1 } },
  ]);

  return result;
};

/**
 * Get best-selling products
 * @param {Number} limit - Number of products to return
 * @param {Date} startDate - Optional start date filter
 * @param {Date} endDate - Optional end date filter
 * @returns {Array} Best-selling products with quantities
 */
const getBestSellingProducts = async (
  limit = 10,
  startDate = null,
  endDate = null,
) => {
  const matchStage = {
    status: { $ne: "cancelled" },
  };

  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  const result = await Order.aggregate([
    { $match: matchStage },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        productName: { $first: "$items.name" },
        totalQuantity: { $sum: "$items.quantity" },
        totalRevenue: { $sum: "$items.subtotal" },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $project: {
        _id: 0,
        productId: "$_id",
        name: "$productName",
        totalQuantity: 1,
        totalRevenue: { $round: ["$totalRevenue", 2] },
        orderCount: 1,
        category: { $arrayElemAt: ["$productDetails.category", 0] },
        currentStock: { $arrayElemAt: ["$productDetails.stock", 0] },
        image: { $arrayElemAt: ["$productDetails.image", 0] },
      },
    },
  ]);

  return result;
};

/**
 * Get category-wise sales
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Array} Sales by category
 */
const getCategorySales = async (startDate = null, endDate = null) => {
  const matchStage = {
    status: { $ne: "cancelled" },
  };

  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  const result = await Order.aggregate([
    { $match: matchStage },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    {
      $group: {
        _id: { $arrayElemAt: ["$productInfo.category", 0] },
        totalQuantity: { $sum: "$items.quantity" },
        totalRevenue: { $sum: "$items.subtotal" },
        orderCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        totalQuantity: 1,
        totalRevenue: { $round: ["$totalRevenue", 2] },
        orderCount: 1,
      },
    },
    { $sort: { totalRevenue: -1 } },
  ]);

  return result;
};

/**
 * Get order status distribution
 * @returns {Object} Count of orders by status
 */
const getOrderStatusDistribution = async () => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$totalAmount" },
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        count: 1,
        totalAmount: { $round: ["$totalAmount", 2] },
      },
    },
  ]);

  // Convert to object format
  return result.reduce((acc, item) => {
    acc[item.status] = {
      count: item.count,
      totalAmount: item.totalAmount,
    };
    return acc;
  }, {});
};

/**
 * Get comprehensive dashboard analytics
 * @param {Number} days - Number of days to look back (default: 30)
 * @returns {Object} Complete analytics data
 */
const getDashboardAnalytics = async (days = 30) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Parallel execution for performance
  const [
    dailyOrders,
    dailyRevenue,
    bestSelling,
    categorySales,
    statusDistribution,
    todayStats,
    totalStats,
    totalProducts,
    recentOrders,
  ] = await Promise.all([
    getDailyOrdersCount(startDate, endDate),
    getDailyRevenue(startDate, endDate),
    getBestSellingProducts(10, startDate, endDate),
    getCategorySales(startDate, endDate),
    getOrderStatusDistribution(),
    // Today's stats
    Order.aggregate([
      { $match: { createdAt: { $gte: todayStart } } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [{ $ne: ["$status", "cancelled"] }, "$totalAmount", 0],
            },
          },
        },
      },
    ]),
    // Total stats
    Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: {
            $sum: {
              $cond: [{ $ne: ["$status", "cancelled"] }, "$totalAmount", 0],
            },
          },
        },
      },
    ]),
    // Total active products count (excludes soft-deleted)
    Product.countDocuments({ isActive: true }),
    // Recent orders
    Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email")
      .select("orderNumber totalAmount status createdAt user"),
  ]);

  return {
    period: {
      startDate,
      endDate,
      days,
    },
    today: {
      orders: todayStats[0]?.count || 0,
      revenue: todayStats[0]?.revenue || 0,
    },
    overall: {
      totalOrders: totalStats[0]?.totalOrders || 0,
      totalRevenue: totalStats[0]?.totalRevenue || 0,
    },
    totalOrders: totalStats[0]?.totalOrders || 0,
    totalRevenue: totalStats[0]?.totalRevenue || 0,
    totalProducts: totalProducts || 0,
    pendingOrders: statusDistribution.pending?.count || 0,
    recentOrders: recentOrders,
    bestSellingProducts: bestSelling,
    dailyOrders,
    dailyRevenue,
    categorySales,
    ordersByStatus: statusDistribution,
  };
};

module.exports = {
  getDailyOrdersCount,
  getDailyRevenue,
  getBestSellingProducts,
  getCategorySales,
  getOrderStatusDistribution,
  getDashboardAnalytics,
};
