import api from './axios';

export const riderApi = {
    // Get rider dashboard stats
    getStats: async () => {
        const response = await api.get('/rider/stats');
        return response.data;
    },

    // Get assigned orders with optional deliveryStatus filter
    getMyOrders: async (params = {}) => {
        const response = await api.get('/rider/orders', { params });
        return response.data;
    },

    // Get single assigned order
    getOrderById: async (id) => {
        const response = await api.get(`/rider/orders/${id}`);
        return response.data;
    },

    // Update delivery status (out_for_delivery | delivered)
    updateDeliveryStatus: async (id, deliveryStatus) => {
        const response = await api.patch(`/rider/orders/${id}/delivery-status`, {
            deliveryStatus,
        });
        return response.data;
    },
};

export default riderApi;
