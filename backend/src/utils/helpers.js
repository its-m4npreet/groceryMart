/**
 * Standard API response helper
 */
const sendResponse = (res, statusCode, success, message, data = null, meta = null) => {
  const response = {
    success,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

/**
 * Success response helper
 */
const successResponse = (res, message, data = null, meta = null, statusCode = 200) => {
  return sendResponse(res, statusCode, true, message, data, meta);
};

/**
 * Error response helper
 */
const errorResponse = (res, message, statusCode = 400, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Pagination helper
 */
const getPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

/**
 * Build filter query from request query params
 */
const buildProductFilter = (query) => {
  const filter = { isActive: true };

  if (query.category) {
    filter.category = query.category.toLowerCase();
  }

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
    ];
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.price = {};
    if (query.minPrice !== undefined) {
      filter.price.$gte = query.minPrice;
    }
    if (query.maxPrice !== undefined) {
      filter.price.$lte = query.maxPrice;
    }
  }

  if (query.inStock === true) {
    filter.stock = { $gt: 0 };
  }

  return filter;
};

/**
 * Build sort object from request query params
 */
const buildSortObject = (sortBy = 'createdAt', sortOrder = 'desc') => {
  const order = sortOrder === 'asc' ? 1 : -1;
  return { [sortBy]: order };
};

module.exports = {
  sendResponse,
  successResponse,
  errorResponse,
  getPaginationMeta,
  buildProductFilter,
  buildSortObject,
};
