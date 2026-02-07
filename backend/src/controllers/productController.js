const Product = require('../models/productModel');
const { uploadImage, deleteImage } = require('../config/cloudinary');
const {
  successResponse,
  errorResponse,
  getPaginationMeta,
  buildProductFilter,
  buildSortObject,
} = require('../utils/helpers');
const { getIO } = require('../sockets');

/**
 * @desc    Get all products with filtering, search, and pagination
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      inStock,
    } = req.query;

    // Build filter
    const filter = buildProductFilter({
      category,
      search,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStock: inStock === 'true',
    });

    // Build sort
    const sort = buildSortObject(sortBy, sortOrder);

    // Get total count
    const total = await Product.countDocuments(filter);

    // Get products with pagination
    const products = await Product.find(filter)
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .select('-__v');

    const meta = getPaginationMeta(Number(page), Number(limit), total);

    return successResponse(res, 'Products retrieved successfully', products, meta);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).select('-__v');

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    return successResponse(res, 'Product retrieved successfully', product);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res, next) => {
  try {
    const { name, category, price, stock, unit, description } = req.body;

    // Handle image upload if file is provided
    let imageData = { image: null, imagePublicId: null };

    if (req.file) {
      const uploadResult = await uploadImage(req.file.buffer, {
        folder: 'grocery-products',
      });
      imageData = {
        image: uploadResult.secure_url,
        imagePublicId: uploadResult.public_id,
      };
    }

    const product = await Product.create({
      name,
      category,
      price,
      stock,
      unit,
      description,
      ...imageData,
    });

    // Emit socket event for real-time update
    const io = getIO();
    if (io) {
      io.emit('product-created', {
        product,
        message: `New product added: ${product.name}`,
      });
    }

    return successResponse(res, 'Product created successfully', product, null, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    // Handle image update if new file is provided
    if (req.file) {
      // Delete old image from Cloudinary
      if (product.imagePublicId) {
        await deleteImage(product.imagePublicId);
      }

      // Upload new image
      const uploadResult = await uploadImage(req.file.buffer, {
        folder: 'grocery-products',
      });
      updates.image = uploadResult.secure_url;
      updates.imagePublicId = uploadResult.public_id;
    }

    // Track if price or stock changed for socket emission
    const priceChanged = updates.price !== undefined && updates.price !== product.price;
    const stockChanged = updates.stock !== undefined && updates.stock !== product.stock;

    // Update product
    Object.assign(product, updates);
    await product.save();

    // Emit socket event for real-time update
    const io = getIO();
    if (io && (priceChanged || stockChanged)) {
      io.emit('product-updated', {
        type: priceChanged && stockChanged ? 'price_and_stock' : priceChanged ? 'price' : 'stock',
        productId: product._id,
        product,
        changes: {
          priceChanged,
          stockChanged,
          oldPrice: priceChanged ? product.price : undefined,
          newPrice: priceChanged ? updates.price : undefined,
          oldStock: stockChanged ? product.stock : undefined,
          newStock: stockChanged ? updates.stock : undefined,
        },
        message: `Product updated: ${product.name}`,
      });
    }

    return successResponse(res, 'Product updated successfully', product);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete product (soft delete by setting isActive to false)
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    // Soft delete - set isActive to false
    product.isActive = false;
    await product.save();

    // Emit socket event for real-time update
    const io = getIO();
    if (io) {
      io.emit('product-deleted', {
        productId: product._id,
        name: product.name,
        permanent: false,
        message: `Product removed: ${product.name}`,
      });
    }

    return successResponse(res, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Permanently delete product and its image
 * @route   DELETE /api/products/:id/permanent
 * @access  Private/Admin
 */
const permanentDeleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    // Delete image from Cloudinary
    if (product.imagePublicId) {
      await deleteImage(product.imagePublicId);
    }

    // Permanently delete from database
    await Product.findByIdAndDelete(id);

    // Emit socket event for real-time update
    const io = getIO();
    if (io) {
      io.emit('product-deleted', {
        productId: id,
        name: product.name,
        permanent: true,
        message: `Product permanently removed: ${product.name}`,
      });
    }

    return successResponse(res, 'Product permanently deleted');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get products by category
 * @route   GET /api/products/category/:category
 * @access  Public
 */
const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!['fruits', 'vegetables', 'grocery'].includes(category.toLowerCase())) {
      return errorResponse(res, 'Invalid category. Must be fruits, vegetables, or grocery', 400);
    }

    const filter = { category: category.toLowerCase(), isActive: true };
    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .select('-__v');

    const meta = getPaginationMeta(Number(page), Number(limit), total);

    return successResponse(res, `${category} products retrieved successfully`, products, meta);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search products by name
 * @route   GET /api/products/search
 * @access  Public
 */
const searchProducts = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q || q.trim().length === 0) {
      return errorResponse(res, 'Search query is required', 400);
    }

    const filter = {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ],
      isActive: true,
    };

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort({ name: 1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .select('-__v');

    const meta = getPaginationMeta(Number(page), Number(limit), total);

    return successResponse(res, 'Search results retrieved successfully', products, meta);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product stock
 * @route   PATCH /api/products/:id/stock
 * @access  Private/Admin
 */
const updateStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stock, operation } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    const oldStock = product.stock;

    if (operation === 'add') {
      product.stock += stock;
    } else if (operation === 'subtract') {
      if (product.stock < stock) {
        return errorResponse(res, 'Insufficient stock', 400);
      }
      product.stock -= stock;
    } else {
      product.stock = stock;
    }

    await product.save();

    // Emit socket event for real-time stock update
    const io = getIO();
    if (io) {
      io.emit('product-updated', {
        type: 'stock',
        productId: product._id,
        productName: product.name,
        oldStock,
        newStock: product.stock,
        message: `Stock updated for ${product.name}: ${oldStock} → ${product.stock}`,
      });
    }

    return successResponse(res, 'Stock updated successfully', {
      productId: product._id,
      name: product.name,
      oldStock,
      newStock: product.stock,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  permanentDeleteProduct,
  getProductsByCategory,
  searchProducts,
  updateStock,
};
