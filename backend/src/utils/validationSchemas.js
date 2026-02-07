const { z } = require("zod");

// MongoDB ObjectId validation regex
const objectIdRegex = /^[a-fA-F0-9]{24}$/;

/**
 * Custom Zod type for MongoDB ObjectId
 */
const objectId = z.string().regex(objectIdRegex, "Invalid MongoDB ObjectId");

/**
 * Product Schemas
 */
const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Product name cannot exceed 100 characters")
    .trim(),
  category: z.enum(["fruits", "vegetables", "grocery"], {
    errorMap: () => ({
      message: "Category must be fruits, vegetables, or grocery",
    }),
  }),
  price: z
    .union([z.number(), z.string()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Price must be a positive number",
    }),
  stock: z
    .union([z.number(), z.string()])
    .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val))
    .refine((val) => !isNaN(val) && Number.isInteger(val) && val >= 0, {
      message: "Stock must be a non-negative whole number",
    }),
  unit: z.enum(["kg", "g", "piece", "dozen", "pack", "liter", "ml"], {
    errorMap: () => ({ message: "Invalid unit type" }),
  }),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .trim()
    .optional()
    .or(z.literal("")), // Allow empty string
});

const updateProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Product name cannot exceed 100 characters")
    .trim()
    .optional(),
  category: z
    .enum(["fruits", "vegetables", "grocery"], {
      errorMap: () => ({
        message: "Category must be fruits, vegetables, or grocery",
      }),
    })
    .optional(),
  price: z
    .union([z.number(), z.string()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Price must be a positive number",
    })
    .optional(),
  stock: z
    .union([z.number(), z.string()])
    .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val))
    .refine((val) => !isNaN(val) && Number.isInteger(val) && val >= 0, {
      message: "Stock must be a non-negative whole number",
    })
    .optional(),
  unit: z
    .enum(["kg", "g", "piece", "dozen", "pack", "liter", "ml"], {
      errorMap: () => ({ message: "Invalid unit type" }),
    })
    .optional(),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  isActive: z
    .union([z.boolean(), z.string()])
    .transform((val) => (typeof val === "string" ? val === "true" : val))
    .optional(),
});

const productQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  category: z.enum(["fruits", "vegetables", "grocery"]).optional(),
  search: z.string().trim().optional(),
  minPrice: z
    .string()
    .regex(/^\d+(\.\d+)?$/)
    .transform(Number)
    .optional(),
  maxPrice: z
    .string()
    .regex(/^\d+(\.\d+)?$/)
    .transform(Number)
    .optional(),
  sortBy: z.enum(["name", "price", "createdAt", "stock"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  inStock: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
});

/**
 * Order Schemas
 */
const orderItemSchema = z.object({
  product: objectId,
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
});

const shippingAddressSchema = z.object({
  street: z.string().min(1, "Street address is required").trim(),
  city: z.string().min(1, "City is required").trim(),
  state: z.string().min(1, "State is required").trim(),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Pincode must be 6 digits")
    .trim(),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number")
    .trim(),
});

const createOrderSchema = z.object({
  items: z
    .array(orderItemSchema)
    .min(1, "Order must have at least one item")
    .max(50, "Order cannot have more than 50 items"),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(["cod", "online"]).default("cod"),
  notes: z
    .string()
    .max(500, "Notes cannot exceed 500 characters")
    .trim()
    .optional(),
});

const updateOrderStatusSchema = z.object({
  status: z.enum(["confirmed", "packed", "shipped", "delivered", "cancelled"], {
    errorMap: () => ({ message: "Invalid order status" }),
  }),
  cancellationReason: z
    .string()
    .max(500, "Cancellation reason cannot exceed 500 characters")
    .trim()
    .optional(),
});

const orderQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  status: z
    .enum([
      "pending",
      "confirmed",
      "packed",
      "shipped",
      "delivered",
      "cancelled",
    ])
    .optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

/**
 * Admin Bulk Operation Schemas
 */
const bulkPriceUpdateSchema = z.object({
  percentage: z
    .number()
    .positive("Percentage must be a positive number")
    .max(100, "Percentage cannot exceed 100"),
  action: z.enum(["increase", "decrease"], {
    errorMap: () => ({ message: "Action must be 'increase' or 'decrease'" }),
  }),
});

const bulkStockUpdateSchema = z.object({
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .nonnegative("Quantity must be non-negative"),
  action: z.enum(["add", "subtract", "set"], {
    errorMap: () => ({ message: "Action must be 'add', 'subtract', or 'set'" }),
  }),
});

/**
 * Common Schemas
 */
const mongoIdParamSchema = z.object({
  id: objectId,
});

module.exports = {
  // Product schemas
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  // Order schemas
  createOrderSchema,
  updateOrderStatusSchema,
  orderQuerySchema,
  orderItemSchema,
  shippingAddressSchema,
  // Admin bulk operation schemas
  bulkPriceUpdateSchema,
  bulkStockUpdateSchema,
  // Common schemas
  mongoIdParamSchema,
  objectId,
};
