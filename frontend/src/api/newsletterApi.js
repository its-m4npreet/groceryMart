import api from './axios';

export const newsletterApi = {
  /**
   * Subscribe to newsletter
   * @param {Object} data - { email: string }
   */
  subscribe: async (data) => {
    const response = await api.post('/newsletter/subscribe', data);
    return response.data;
  },

  /**
   * Unsubscribe from newsletter
   * @param {Object} data - { email: string }
   */
  unsubscribe: async (data) => {
    const response = await api.post('/newsletter/unsubscribe', data);
    return response.data;
  },
};
