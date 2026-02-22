const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: {
        values: [
          'fruits',
          'vegetables',
          'grocery',
          'bakery',
          'beverages',
          'snacks',
          'cold-drinks',
          'dairy',
          'frozen',
          'personal-care',
          'daily-essentials'
        ],
        message: 'Invalid category selected',
      },
      lowercase: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    unit: {
      type: String,
      required: [true, 'Product unit is required'],
      enum: {
        values: [
          'kg',
          'g',
          'piece',
          'dozen',
          'pack',
          'liter',
          'ml',
          'tube',
          'box',
          'bottle',
          'can',
          'jar',
          'bag',
          'bundle',
          'tray',
          'carton',
        ],
        message: 'Invalid unit type',
      },
      default: 'kg',
    },
    image: {
      type: String,
      default: null,
    },
    imagePublicId: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isHotDeal: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
      default: 0,
    },
    discountExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
productSchema.index({ name: 'text', description: 'text' }); // Text search
productSchema.index({ category: 1, isActive: 1, createdAt: -1 }); // Category listing
productSchema.index({ isActive: 1, createdAt: -1 }); // General listing
productSchema.index({ price: 1 }); // Price sorting
productSchema.index({ isActive: 1 }); // Active products filter
productSchema.index({ isHotDeal: 1 }); // Hot deals filter

// Virtual for formatted price
productSchema.virtual('formattedPrice').get(function () {
  if (this.price == null || this.unit == null) {
    return null;
  }
  return `₹${this.price.toFixed(2)}/${this.unit}`;
});

// Instance method to check if product is in stock
productSchema.methods.isInStock = function (quantity = 1) {
  return this.stock >= quantity;
};

// Instance method to check if discount is valid (not expired)
productSchema.methods.isDiscountValid = function () {
  if (!this.discount || this.discount <= 0) {
    return false;
  }
  if (!this.discountExpiry) {
    return true; // No expiry set, discount is always valid
  }
  return new Date() < new Date(this.discountExpiry);
};

// Instance method to get effective price (with discount if valid)
productSchema.methods.getEffectivePrice = function () {
  if (this.isDiscountValid()) {
    return this.price * (1 - this.discount / 100);
  }
  return this.price;
};

// Instance method to reduce stock
productSchema.methods.reduceStock = async function (quantity) {
  if (this.stock < quantity) {
    throw new Error(`Insufficient stock for ${this.name}`);
  }
  this.stock -= quantity;
  return this.save();
};

// Instance method to increase stock
productSchema.methods.increaseStock = async function (quantity) {
  this.stock += quantity;
  return this.save();
};

// Static method to find products by category
productSchema.statics.findByCategory = function (category) {
  return this.find({ category, isActive: true });
};

// Static method to search products
productSchema.statics.search = function (query) {
  return this.find({
    $text: { $search: query },
    isActive: true,
  }).sort({ score: { $meta: 'textScore' } });
};

// Static method to clean up expired deals
productSchema.statics.cleanupExpiredDeals = async function () {
  const now = new Date();
  const result = await this.updateMany(
    {
      discountExpiry: { $ne: null, $lte: now },
      $or: [
        { isHotDeal: true },
        { discount: { $gt: 0 } },
      ],
    },
    {
      $set: {
        isHotDeal: false,
        discount: 0,
        discountExpiry: null,
      },
    }
  );
  return result.modifiedCount;
};

// Ensure virtuals are included when converting to JSON
productSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    // Add computed field for discount validity
    ret.isDiscountActive = doc.isDiscountValid();
    return ret;
  }
});
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
