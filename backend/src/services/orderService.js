const Order = require('../models/orderModel');
const { getIO } = require('../sockets');

/**
 * Valid order status transitions
 * Ensures strict flow: pending → confirmed → packed → shipped → delivered
 */
const VALID_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['packed', 'cancelled'],
  packed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [], // Final state
  cancelled: [], // Final state
};

/**
 * Validate if a status transition is allowed
 * @param {String} currentStatus 
 * @param {String} newStatus 
 * @returns {Object} { valid: boolean, message: string }
 */
const validateStatusTransition = (currentStatus, newStatus) => {
  const allowedTransitions = VALID_TRANSITIONS[currentStatus] || [];

  if (!allowedTransitions.includes(newStatus)) {
    return {
      valid: false,
      message: `Invalid status transition. Cannot change from '${currentStatus}' to '${newStatus}'. Allowed transitions: ${allowedTransitions.join(', ') || 'none (final state)'}`,
    };
  }

  return { valid: true };
};

/**
 * Update order status with validation and history tracking
 * @param {Object} order - Order document
 * @param {String} newStatus - New status to set
 * @param {String} adminId - Admin user ID making the change
 * @param {String} reason - Optional reason (for cancellation)
 * @returns {Object} Updated order
 */
const updateOrderStatus = async (order, newStatus, adminId, reason = null) => {
  // Validate transition
  const validation = validateStatusTransition(order.status, newStatus);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  const oldStatus = order.status;

  // Update status
  order.status = newStatus;

  // Add to status history
  order.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    updatedBy: adminId,
  });

  // Handle special cases
  if (newStatus === 'delivered') {
    order.deliveredAt = new Date();
    if (order.paymentMethod === 'cod') {
      order.paymentStatus = 'paid';
    }
  }

  if (newStatus === 'cancelled') {
    order.cancelledAt = new Date();
    if (reason) {
      order.cancellationReason = reason;
    }
  }

  await order.save();

  // Emit socket events
  emitOrderStatusUpdate(order, oldStatus, newStatus);

  return order;
};

/**
 * Emit socket events for order status updates
 * @param {Object} order - Order document
 * @param {String} oldStatus 
 * @param {String} newStatus 
 */
const emitOrderStatusUpdate = (order, oldStatus, newStatus) => {
  const io = getIO();
  if (!io) return;

  const eventData = {
    orderId: order._id,
    orderNumber: order.orderNumber,
    oldStatus,
    newStatus,
    updatedAt: new Date(),
  };

  // Notify the customer
  io.to(`user:${order.user._id || order.user}`).emit('order-status-updated', {
    ...eventData,
    message: `Your order ${order.orderNumber} is now ${newStatus}`,
  });

  // Notify admin dashboard
  io.to('admin').emit('order-status-updated', {
    ...eventData,
    userId: order.user._id || order.user,
    message: `Order ${order.orderNumber} status: ${oldStatus} → ${newStatus}`,
  });
};

/**
 * Emit socket event for new order
 * @param {Object} order - Order document
 */
const emitNewOrder = (order) => {
  const io = getIO();
  if (!io) return;

  // Notify admin about new order
  io.to('admin').emit('new-order', {
    orderId: order._id,
    orderNumber: order.orderNumber,
    userId: order.user._id || order.user,
    totalAmount: order.totalAmount,
    itemCount: order.items.length,
    createdAt: order.createdAt,
    message: `New order received: ${order.orderNumber}`,
  });
};

/**
 * Get orders with filters for admin
 * @param {Object} filters - Query filters
 * @param {Object} options - Pagination and sort options
 * @returns {Object} { orders, total, page, limit }
 */
const getOrdersForAdmin = async (filters = {}, options = {}) => {
  const {
    status,
    userId,
    startDate,
    endDate,
    minAmount,
    maxAmount,
  } = filters;

  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = options;

  const query = {};

  if (status) query.status = status;
  if (userId) query.user = userId;

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  if (minAmount || maxAmount) {
    query.totalAmount = {};
    if (minAmount) query.totalAmount.$gte = Number(minAmount);
    if (maxAmount) query.totalAmount.$lte = Number(maxAmount);
  }

  const total = await Order.countDocuments(query);

  const orders = await Order.find(query)
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user', 'name email')
    .populate('items.product', 'name image')
    .populate('statusHistory.updatedBy', 'name');

  return {
    orders,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

module.exports = {
  VALID_TRANSITIONS,
  validateStatusTransition,
  updateOrderStatus,
  emitOrderStatusUpdate,
  emitNewOrder,
  getOrdersForAdmin,
};
