const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    unit: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      default: null,
    },
    subtotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    items: {
      type: [orderItemSchema],
      required: [true, 'Order items are required'],
      validate: {
        validator: function (items) {
          return items && items.length > 0;
        },
        message: 'Order must have at least one item',
      },
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'],
        message: 'Invalid order status',
      },
      default: 'pending',
    },
    shippingAddress: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      pincode: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'online'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    assignedRider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    deliveryStatus: {
      type: String,
      enum: ['pending', 'assigned', 'out_for_delivery', 'delivered'],
      default: 'pending',
    },
    deliveryStatusHistory: [
      {
        status: {
          type: String,
          enum: ['pending', 'assigned', 'out_for_delivery', 'delivered'],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    deliveredAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
orderSchema.index({ user: 1, createdAt: -1 }); // User's orders sorted by date
orderSchema.index({ status: 1 }); // Filter by status
orderSchema.index({ createdAt: -1 }); // Sort by date
orderSchema.index({ assignedRider: 1, deliveryStatus: 1 }); // Rider's assigned orders

// Pre-save middleware to add initial status to history
orderSchema.pre('save', function () {
  if (this.isNew) {
    this.statusHistory = [
      {
        status: 'pending',
        timestamp: new Date(),
      },
    ];
  }
});

// Instance method to update order status
orderSchema.methods.updateStatus = async function (newStatus, userId) {
  const validTransitions = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['packed', 'cancelled'],
    packed: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
  };

  if (!validTransitions[this.status].includes(newStatus)) {
    throw new Error(`Cannot transition from ${this.status} to ${newStatus}`);
  }

  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    updatedBy: userId,
  });

  if (newStatus === 'delivered') {
    this.deliveredAt = new Date();
    if (this.paymentMethod === 'cod') {
      this.paymentStatus = 'paid';
    }
  }

  if (newStatus === 'cancelled') {
    this.cancelledAt = new Date();
  }

  return this.save();
};

// Instance method to cancel order
orderSchema.methods.cancelOrder = async function (reason, userId) {
  if (['delivered', 'cancelled'].includes(this.status)) {
    throw new Error('Cannot cancel this order');
  }

  this.status = 'cancelled';
  this.cancelledAt = new Date();
  this.cancellationReason = reason;
  this.statusHistory.push({
    status: 'cancelled',
    timestamp: new Date(),
    updatedBy: userId,
  });

  return this.save();
};

// Instance method to assign rider
orderSchema.methods.assignRider = async function (riderId, userId) {
  if (this.status === 'cancelled' || this.status === 'delivered') {
    throw new Error('Cannot assign rider to this order');
  }

  this.assignedRider = riderId;
  this.deliveryStatus = 'assigned';
  this.deliveryStatusHistory.push({
    status: 'assigned',
    timestamp: new Date(),
    updatedBy: userId,
  });

  return this.save();
};

// Instance method to update delivery status (rider only)
orderSchema.methods.updateDeliveryStatus = async function (newStatus, riderId) {
  const validTransitions = {
    pending: ['assigned'],
    assigned: ['out_for_delivery'],
    out_for_delivery: ['delivered'],
    delivered: [],
  };

  if (!validTransitions[this.deliveryStatus].includes(newStatus)) {
    throw new Error(`Cannot transition from ${this.deliveryStatus} to ${newStatus}`);
  }

  this.deliveryStatus = newStatus;
  this.deliveryStatusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    updatedBy: riderId,
  });

  // Auto-update order status when delivery status changes
  if (newStatus === 'out_for_delivery' && this.status !== 'shipped') {
    this.status = 'shipped';
    this.statusHistory.push({
      status: 'shipped',
      timestamp: new Date(),
      updatedBy: riderId,
    });
  }

  if (newStatus === 'delivered') {
    this.status = 'delivered';
    this.deliveredAt = new Date();
    if (this.paymentMethod === 'cod') {
      this.paymentStatus = 'paid';
    }
    this.statusHistory.push({
      status: 'delivered',
      timestamp: new Date(),
      updatedBy: riderId,
    });
  }

  return this.save();
};

// Static method to get user's orders
orderSchema.statics.findByUser = function (userId, options = {}) {
  const { page = 1, limit = 10, status } = options;
  const query = { user: userId };

  if (status) {
    query.status = status;
  }

  return this.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('items.product', 'name image');
};

// Static method to get order statistics
orderSchema.statics.getStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' },
      },
    },
  ]);

  return stats.reduce((acc, stat) => {
    acc[stat._id] = {
      count: stat.count,
      totalAmount: stat.totalAmount,
    };
    return acc;
  }, {});
};

// Virtual for order number (formatted ID)
orderSchema.virtual('orderNumber').get(function () {
  return `ORD-${this._id.toString().slice(-8).toUpperCase()}`;
});

// Ensure virtuals are included when converting to JSON
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
