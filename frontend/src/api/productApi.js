import api from './axios';

export const productApi = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get single product by ID
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query, params = {}) => {
    const response = await api.get('/products/search', { 
      params: { q: query, ...params } 
    });
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category, params = {}) => {
    const response = await api.get(`/products/category/${category}`, { params });
    return response.data;
  },

  // Create product (Admin)
  createProduct: async (formData) => {
    const response = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Update product (Admin)
  updateProduct: async (id, formData) => {
    const response = await api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Update stock (Admin)
  updateStock: async (id, data) => {
    const response = await api.patch(`/products/${id}/stock`, data);
    return response.data;
  },

  // Delete product (Admin - soft delete)
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Permanently delete product (Admin)
  permanentDeleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}/permanent`);
    return response.data;
  },
};

export default productApi;
