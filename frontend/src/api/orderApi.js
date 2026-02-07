import api from './axios';

export const orderApi = {
  // Create new order
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get user's orders
  getMyOrders: async (params = {}) => {
    const response = await api.get('/orders/my-orders', { params });
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Cancel order (User)
  cancelOrder: async (id, reason = '') => {
    const response = await api.patch(`/orders/${id}/cancel`, { reason });
    return response.data;
  },
};

export default orderApi;
