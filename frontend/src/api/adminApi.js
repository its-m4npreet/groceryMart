import api from './axios';

export const adminApi = {
  // Get all orders (Admin)
  getAllOrders: async (params = {}) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  // Get order by ID (Admin)
  getOrderById: async (id) => {
    const response = await api.get(`/admin/orders/${id}`);
    return response.data;
  },

  // Update order status (Admin)
  updateOrderStatus: async (id, data) => {
    const response = await api.put(`/admin/orders/${id}/status`, data);
    return response.data;
  },

  // Get dashboard analytics
  getDashboard: async (days = 30) => {
    const response = await api.get('/admin/analytics/dashboard', { 
      params: { days } 
    });
    return response.data;
  },

  // Get order summary
  getOrderSummary: async () => {
    const response = await api.get('/admin/analytics/summary');
    return response.data;
  },

  // Get best selling products
  getBestSelling: async (params = {}) => {
    const response = await api.get('/admin/analytics/best-selling', { params });
    return response.data;
  },

  // Get low stock products
  getLowStock: async (threshold = 10) => {
    const response = await api.get('/admin/analytics/low-stock', { 
      params: { threshold } 
    });
    return response.data;
  },
};

export default adminApi;
