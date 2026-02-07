import api from './axios';

export const authApi = {
  // Sign up new user
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  // Sign in user
  signin: async (credentials) => {
    const response = await api.post('/auth/signin', credentials);
    return response.data;
  },

  // Verify token (optional endpoint if backend supports it)
  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

export default authApi;
