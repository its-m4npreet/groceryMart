const Order = require('../models/orderModel');
const { successResponse, errorResponse, getPaginationMeta } = require('../utils/helpers');
const { getIO } = require('../sockets');

/**
 * @desc    Get orders assigned to logged-in rider
 * @route   GET /api/rider/orders
 * @access  Private/Rider
 */
const getMyAssignedOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, deliveryStatus } = req.query;
    const riderId = req.user._id;

    const query = { assignedRider: riderId };
    
    // Filter by delivery status if provided
    if (deliveryStatus) {
      query.deliveryStatus = deliveryStatus;
    }

    const total = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('user', 'name phone email')
      .populate('items.product', 'name image category')
      .select('-paymentStatus -notes'); // Hide sensitive payment info

    const pagination = getPaginationMeta(
      Number(page),
      Number(limit),
      total
    );

    return successResponse(
      res,
      'Assigned orders retrieved successfully',
      orders,
      pagination
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single order details (rider can only view assigned orders)
 * @route   GET /api/rider/orders/:id
 * @access  Private/Rider
 */
const getAssignedOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const riderId = req.user._id;

    const order = await Order.findOne({
      _id: id,
      assignedRider: riderId,
    })
      .populate('user', 'name phone email')
      .populate('items.product', 'name image category unit')
      .select('-paymentStatus -notes'); // Hide sensitive info

    if (!order) {
      return errorResponse(
        res,
        'Order not found or not assigned to you',
        404
      );
    }

    return successResponse(
      res,
      'Order details retrieved successfully',
      order
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update delivery status of assigned order
 * @route   PATCH /api/rider/orders/:id/delivery-status
 * @access  Private/Rider
 */
const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { deliveryStatus } = req.body;
    const riderId = req.user._id;

    // Validate delivery status
    const validStatuses = ['out_for_delivery', 'delivered'];
    if (!validStatuses.includes(deliveryStatus)) {
      return errorResponse(
        res,
        'Invalid delivery status. Allowed: out_for_delivery, delivered',
        400
      );
    }

    // Find order assigned to this rider
    const order = await Order.findOne({
      _id: id,
      assignedRider: riderId,
    });

    if (!order) {
      return errorResponse(
        res,
        'Order not found or not assigned to you',
        404
      );
    }

    // Check if order is cancelled
    if (order.status === 'cancelled') {
      return errorResponse(
        res,
        'Cannot update delivery status of cancelled order',
        400
      );
    }

    // Update delivery status using instance method
    try {
      await order.updateDeliveryStatus(deliveryStatus, riderId);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }

    // Populate order for response
    await order.populate('user', 'name phone email');
    await order.populate('items.product', 'name image');

    // Emit socket event for real-time updates
    const io = getIO();
    if (io) {
      // Notify customer
      io.to(`user_${order.user._id}`).emit('order-status-updated', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        deliveryStatus: order.deliveryStatus,
        message: `Your order is ${deliveryStatus.replace('_', ' ')}`,
      });

      // Notify admins
      io.to('admin').emit('delivery-status-updated', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        riderId: riderId,
        riderName: req.user.name,
        deliveryStatus: order.deliveryStatus,
        status: order.status,
      });
    }

    return successResponse(
      res,
      'Delivery status updated successfully',
      {
        orderId: order._id,
        orderNumber: order.orderNumber,
        deliveryStatus: order.deliveryStatus,
        status: order.status,
        deliveredAt: order.deliveredAt,
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get rider dashboard stats
 * @route   GET /api/rider/stats
 * @access  Private/Rider
 */
const getRiderStats = async (req, res, next) => {
  try {
    const riderId = req.user._id;

    const stats = await Order.aggregate([
      { $match: { assignedRider: riderId } },
      {
        $group: {
          _id: '$deliveryStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    // Format stats
    const formattedStats = {
      total: 0,
      pending: 0,
      assigned: 0,
      out_for_delivery: 0,
      delivered: 0,
    };

    stats.forEach((stat) => {
      formattedStats[stat._id] = stat.count;
      formattedStats.total += stat.count;
    });

    // Get today's deliveries
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayDeliveries = await Order.countDocuments({
      assignedRider: riderId,
      deliveryStatus: 'delivered',
      deliveredAt: { $gte: today },
    });

    formattedStats.todayDeliveries = todayDeliveries;

    return successResponse(
      res,
      'Rider statistics retrieved successfully',
      formattedStats
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyAssignedOrders,
  getAssignedOrderById,
  updateDeliveryStatus,
  getRiderStats,
};
