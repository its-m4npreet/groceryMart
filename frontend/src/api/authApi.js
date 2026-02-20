import api from "./axios";

export const authApi = {
  // Sign up new user
  signup: async (userData) => {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  },

  // Sign in user
  signin: async (credentials) => {
    const response = await api.post("/auth/signin", credentials);
    return response.data;
  },

  // Verify token (optional endpoint if backend supports it)
  verifyToken: async () => {
    const response = await api.get("/auth/verify");
    return response.data;
  },

  // Request password reset link
  forgotPassword: async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to send reset link");
    }
  },

  // Reset password
  resetPassword: async (token, password) => {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, {
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to reset password");
    }
  },
};

export default authApi;
