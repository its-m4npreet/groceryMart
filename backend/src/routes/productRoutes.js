const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  permanentDeleteProduct,
  getProductsByCategory,
  searchProducts,
  updateStock,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/auth");
const {
  validateBody,
  validateParams,
  validateQuery,
} = require("../middleware/validate");
const { uploadLimiter } = require("../middleware/rateLimiter");
const { uploadProductImage, handleMulterError } = require("../config/multer");
const {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  mongoIdParamSchema,
} = require("../utils/validationSchemas");

/**
 * @route   GET /api/products
 * @desc    Get all products with filtering, search, and pagination
 * @access  Public
 * @query   page, limit, category, search, minPrice, maxPrice, sortBy, sortOrder, inStock
 */
router.get("/", getProducts);

/**
 * @route   GET /api/products/search
 * @desc    Search products by name
 * @access  Public
 * @query   q (search query), page, limit
 */
router.get("/search", searchProducts);

/**
 * @route   GET /api/products/category/:category
 * @desc    Get products by category
 * @access  Public
 * @param   category - fruits, vegetables, or grocery
 */
router.get("/category/:category", getProductsByCategory);

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get("/:id", validateParams(mongoIdParamSchema), getProductById);

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @access  Private/Admin
 * @body    name, category, price, stock, unit, description
 * @file    image (optional)
 */
router.post(
  "/",
  protect,
  adminOnly,
  uploadLimiter,
  uploadProductImage.single("image"),
  handleMulterError,
  validateBody(createProductSchema),
  createProduct,
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Private/Admin
 * @body    name, category, price, stock, unit, description, isActive
 * @file    image (optional)
 */
router.put(
  "/:id",
  protect,
  adminOnly,
  validateParams(mongoIdParamSchema),
  uploadProductImage.single("image"),
  handleMulterError,
  validateBody(updateProductSchema),
  updateProduct,
);

/**
 * @route   PATCH /api/products/:id/stock
 * @desc    Update product stock
 * @access  Private/Admin
 * @body    stock, operation (add/subtract/set)
 */
router.patch(
  "/:id/stock",
  protect,
  adminOnly,
  validateParams(mongoIdParamSchema),
  updateStock,
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Soft delete product (set isActive to false)
 * @access  Private/Admin
 */
router.delete(
  "/:id",
  protect,
  adminOnly,
  validateParams(mongoIdParamSchema),
  deleteProduct,
);

/**
 * @route   DELETE /api/products/:id/permanent
 * @desc    Permanently delete product and its image
 * @access  Private/Admin
 */
router.delete(
  "/:id/permanent",
  protect,
  adminOnly,
  validateParams(mongoIdParamSchema),
  permanentDeleteProduct,
);

module.exports = router;
