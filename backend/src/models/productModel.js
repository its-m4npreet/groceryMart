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
        values: ['fruits', 'vegetables', 'grocery'],
        message: 'Category must be fruits, vegetables, or grocery',
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
        values: ['kg', 'g', 'piece', 'dozen', 'pack', 'liter', 'ml'],
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
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
productSchema.index({ name: 'text', description: 'text' }); // Text search
productSchema.index({ category: 1 }); // Category filter
productSchema.index({ price: 1 }); // Price sorting
productSchema.index({ isActive: 1 }); // Active products filter

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

// Ensure virtuals are included when converting to JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
