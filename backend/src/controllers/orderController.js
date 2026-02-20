const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const { successResponse, errorResponse, getPaginationMeta } = require('../utils/helpers');
const { getIO } = require('../sockets');
const { validateStock, calculateOrderTotals, deductStockAtomic } = require('../services/stockService');
const { emitNewOrder } = require('../services/orderService');

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 * 
 * IMPORTANT: Never trust frontend prices!
 * - Validate stock availability
 * - Fetch prices from database
 * - Calculate totals on backend
 * - Deduct stock atomically
 */
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;
    const userId = req.user._id;

    // Step 1: Validate stock availability
    const stockValidation = await validateStock(items);
    if (!stockValidation.valid) {
      return errorResponse(res, 'Stock validation failed', 400, stockValidation.errors);
    }

    // Step 2: Calculate order totals using DB prices (NEVER trust frontend)
    const { orderItems, totalAmount } = calculateOrderTotals(items, stockValidation.products);

    // Step 3: Deduct stock atomically (prevents overselling)
    try {
      await deductStockAtomic(orderItems);
    } catch (stockError) {
      return errorResponse(res, stockError.message, 400);
    }

    // Step 4: Create order with calculated values
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      notes,
    });

    // Populate order details for response
    await order.populate('user', 'name email');

    // Step 5: Emit socket events for real-time updates
    emitNewOrder(order);

    // Emit stock updates
    const io = getIO();
    if (io) {
      for (const item of orderItems) {
        const updatedProduct = stockValidation.products.get(item.product.toString());
        if (updatedProduct) {
          io.emit('product-updated', {
            type: 'stock',
            productId: item.product,
            productName: item.name,
            newStock: updatedProduct.stock - item.quantity,
            message: `Stock updated for ${item.name}`,
          });
        }
      }
    }

    return successResponse(res, 'Order placed successfully', order, null, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged-in user's orders
 * @route   GET /api/orders/my-orders
 * @access  Private
 */
const getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const userId = req.user._id;

    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    const total = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('items.product', 'name image')
      .select('-__v');

    const meta = getPaginationMeta(Number(page), Number(limit), total);

    return successResponse(res, 'Orders retrieved successfully', orders, meta);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    const order = await Order.findById(id)
      .populate('user', 'name email')
      .populate('items.product', 'name image')
      .populate('statusHistory.updatedBy', 'name');

    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    // Check if user owns the order or is admin
    if (!isAdmin && order.user._id.toString() !== userId.toString()) {
      return errorResponse(res, 'Not authorized to view this order', 403);
    }

    return successResponse(res, 'Order retrieved successfully', order);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders (Admin only)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const total = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('user', 'name email')
      .populate('items.product', 'name image')
      .select('-__v');

    const meta = getPaginationMeta(Number(page), Number(limit), total);

    return successResponse(res, 'Orders retrieved successfully', orders, meta);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status (Admin only)
 * @route   PATCH /api/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, cancellationReason } = req.body;
    const adminId = req.user._id;

    const order = await Order.findById(id).populate('user', 'name email');

    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    // Validate status transition
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['packed', 'cancelled'],
      packed: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: [],
    };

    if (!validTransitions[order.status].includes(status)) {
      return errorResponse(
        res,
        `Cannot change order status from ${order.status} to ${status}`,
        400
      );
    }

    // Handle cancellation - restore stock
    if (status === 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
      order.cancellationReason = cancellationReason;
    }

    // Update order status using model method
    await order.updateStatus(status, adminId);

    // Emit socket event for real-time update
    const io = getIO();
    if (io) {
      // Notify customer about order status change
      io.to(`user:${order.user._id}`).emit('order:statusUpdated', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        oldStatus: order.status,
        newStatus: status,
        message: `Your order ${order.orderNumber} status changed to ${status}`,
      });

      // Notify admin dashboard
      io.to('admin').emit('order:statusUpdated', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status,
        message: `Order ${order.orderNumber} status updated to ${status}`,
      });

      // If cancelled, emit stock updates
      if (status === 'cancelled') {
        for (const item of order.items) {
          const updatedProduct = await Product.findById(item.product);
          io.emit('product:stockUpdated', {
            productId: item.product,
            productName: item.name,
            newStock: updatedProduct.stock,
            message: `Stock restored for ${item.name}`,
          });
        }
      }
    }

    // Reload order with populated fields
    await order.populate('statusHistory.updatedBy', 'name');

    return successResponse(res, 'Order status updated successfully', order);
  } catch (error) {
    if (error.message.includes('Cannot transition')) {
      return errorResponse(res, error.message, 400);
    }
    next(error);
  }
};

/**
 * @desc    Cancel order (User can cancel their own pending/confirmed orders)
 * @route   PATCH /api/orders/:id/cancel
 * @access  Private
 */
const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    const order = await Order.findById(id);

    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    // Check if user owns the order
    if (order.user.toString() !== userId.toString()) {
      return errorResponse(res, 'Not authorized to cancel this order', 403);
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.status)) {
      return errorResponse(
        res,
        'Order cannot be cancelled at this stage. Please contact support.',
        400
      );
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    // Cancel order
    await order.cancelOrder(reason, userId);

    // Emit socket events
    const io = getIO();
    if (io) {
      // Notify admin about cancellation
      io.to('admin').emit('order:cancelled', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        reason,
        message: `Order ${order.orderNumber} cancelled by customer`,
      });

      // Emit stock updates
      for (const item of order.items) {
        const updatedProduct = await Product.findById(item.product);
        io.emit('product:stockUpdated', {
          productId: item.product,
          productName: item.name,
          newStock: updatedProduct.stock,
          message: `Stock restored for ${item.name}`,
        });
      }
    }

    return successResponse(res, 'Order cancelled successfully', order);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order statistics (Admin only)
 * @route   GET /api/orders/stats
 * @access  Private/Admin
 */
const getOrderStats = async (req, res, next) => {
  try {
    const stats = await Order.getStats();

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: todayStart },
    });

    return successResponse(res, 'Order statistics retrieved successfully', {
      statusWise: stats,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      todayOrders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Assign rider to an order (Admin only)
 * @route   PATCH /api/orders/:id/assign-rider
 * @access  Private/Admin
 */
const assignRiderToOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { riderId } = req.body;
    const adminId = req.user._id;

    // Validate rider exists and has rider role
    const User = require('../models/userModel');
    const rider = await User.findById(riderId);

    if (!rider) {
      return errorResponse(res, 'Rider not found', 404);
    }

    if (rider.role !== 'rider') {
      return errorResponse(res, 'User is not a rider', 400);
    }

    // Check if rider is active
    if (!rider.isActive) {
      return errorResponse(res, 'Cannot assign order to an inactive rider', 400);
    }

    // Find order
    const order = await Order.findById(id);

    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    // Check if order can be assigned
    if (order.status === 'cancelled') {
      return errorResponse(res, 'Cannot assign rider to cancelled order', 400);
    }

    if (order.status === 'delivered') {
      return errorResponse(res, 'Order already delivered', 400);
    }

    // Assign rider using instance method
    try {
      await order.assignRider(riderId, adminId);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }

    // Populate order for response
    await order.populate('assignedRider', 'name email phone');
    await order.populate('user', 'name email phone');

    // Emit socket events
    const io = getIO();
    if (io) {
      // Notify rider
      io.to(`user_${riderId}`).emit('order-assigned', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        customerName: order.user.name,
        deliveryAddress: order.shippingAddress,
        message: 'New order assigned to you',
      });

      // Notify customer
      io.to(`user_${order.user._id}`).emit('rider-assigned', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        riderName: rider.name,
        riderPhone: rider.phone,
        message: 'Delivery rider assigned to your order',
      });

      // Notify admins
      io.to('admin').emit('rider-assigned-to-order', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        riderId: riderId,
        riderName: rider.name,
        assignedBy: req.user.name,
      });
    }

    return successResponse(res, 'Rider assigned successfully', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      assignedRider: {
        id: rider._id,
        name: rider.name,
        phone: rider.phone,
      },
      deliveryStatus: order.deliveryStatus,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
  assignRiderToOrder,
};
