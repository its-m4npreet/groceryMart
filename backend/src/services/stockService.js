const Product = require('../models/productModel');
const mongoose = require('mongoose');

/**
 * Validate stock availability for order items
 * @param {Array} items - Array of {product: ObjectId, quantity: Number}
 * @returns {Object} { valid: boolean, errors: [], products: Map }
 */
const validateStock = async (items) => {
  const errors = [];
  const products = new Map();

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product) {
      errors.push({
        product: item.product,
        message: `Product not found: ${item.product}`,
      });
      continue;
    }

    if (!product.isActive) {
      errors.push({
        product: item.product,
        name: product.name,
        message: `Product is not available: ${product.name}`,
      });
      continue;
    }

    if (product.stock < item.quantity) {
      errors.push({
        product: item.product,
        name: product.name,
        available: product.stock,
        requested: item.quantity,
        message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
      });
      continue;
    }

    products.set(item.product.toString(), product);
  }

  return {
    valid: errors.length === 0,
    errors,
    products,
  };
};

/**
 * Calculate order totals from validated products
 * NEVER trust frontend prices - always fetch from DB
 * @param {Array} items - Array of {product: ObjectId, quantity: Number}
 * @param {Map} products - Map of productId -> product document
 * @returns {Object} { orderItems: [], totalAmount: Number }
 */
const calculateOrderTotals = (items, products) => {
  const orderItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const product = products.get(item.product.toString());
    if (!product) continue;

    // Get effective price (checks discount expiry)
    const effectivePrice = product.getEffectivePrice();
    const subtotal = effectivePrice * item.quantity;

    orderItems.push({
      product: product._id,
      name: product.name,
      price: effectivePrice, // Use effective price (with valid discount if applicable)
      quantity: item.quantity,
      unit: product.unit,
      image: product.image,
      category: product.category,
      subtotal,
    });

    totalAmount += subtotal;
  }

  return { orderItems, totalAmount };
};

/**
 * Deduct stock atomically using MongoDB transactions
 * Ensures stock never goes negative
 * @param {Array} orderItems - Array of order items with product and quantity
 * @param {Object} session - MongoDB session for transaction
 * @returns {Object} { success: boolean, updatedProducts: [] }
 */
const deductStockAtomic = async (orderItems, session = null) => {
  const updatedProducts = [];
  const updateOptions = session ? { session } : {};

  for (const item of orderItems) {
    // Use findOneAndUpdate with $inc and condition to prevent negative stock
    const result = await Product.findOneAndUpdate(
      {
        _id: item.product,
        stock: { $gte: item.quantity }, // Only update if sufficient stock
      },
      {
        $inc: { stock: -item.quantity },
      },
      {
        new: true,
        ...updateOptions,
      }
    );

    if (!result) {
      throw new Error(`Failed to deduct stock for ${item.name}. Stock may have changed.`);
    }

    updatedProducts.push({
      productId: result._id,
      name: result.name,
      oldStock: result.stock + item.quantity,
      newStock: result.stock,
      deducted: item.quantity,
    });
  }

  return { success: true, updatedProducts };
};

/**
 * Restore stock when order is cancelled
 * @param {Array} orderItems - Array of order items with product and quantity
 * @param {Object} session - MongoDB session for transaction
 * @returns {Object} { success: boolean, updatedProducts: [] }
 */
const restoreStock = async (orderItems, session = null) => {
  const updatedProducts = [];
  const updateOptions = session ? { session } : {};

  for (const item of orderItems) {
    const result = await Product.findByIdAndUpdate(
      item.product,
      { $inc: { stock: item.quantity } },
      { new: true, ...updateOptions }
    );

    if (result) {
      updatedProducts.push({
        productId: result._id,
        name: result.name,
        oldStock: result.stock - item.quantity,
        newStock: result.stock,
        restored: item.quantity,
      });
    }
  }

  return { success: true, updatedProducts };
};

/**
 * Get low stock products (for admin alerts)
 * @param {Number} threshold - Stock threshold (default: 10)
 * @returns {Array} Products with stock below threshold
 */
const getLowStockProducts = async (threshold = 10) => {
  return await Product.find({
    stock: { $lte: threshold },
    isActive: true,
  })
    .select('name category stock unit')
    .sort({ stock: 1 });
};

module.exports = {
  validateStock,
  calculateOrderTotals,
  deductStockAtomic,
  restoreStock,
  getLowStockProducts,
};
