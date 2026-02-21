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

  // ---- Rider Management ----

  // Get all riders
  getAllRiders: async (params = {}) => {
    const response = await api.get('/admin/riders', { params });
    return response.data;
  },

  // Get single rider by ID
  getRiderById: async (id) => {
    const response = await api.get(`/admin/riders/${id}`);
    return response.data;
  },

  // Toggle rider active/inactive status
  toggleRiderStatus: async (id) => {
    const response = await api.patch(`/admin/riders/${id}/toggle-status`);
    return response.data;
  },

  // Assign an active rider to deliver an order
  assignRider: async (orderId, riderId) => {
    const response = await api.patch(`/admin/orders/${orderId}/assign-rider`, { riderId });
    return response.data;
  },
};

export default adminApi;
