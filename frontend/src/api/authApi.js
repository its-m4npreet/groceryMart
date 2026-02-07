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

  // Request password reset OTP
  forgotPassword: async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to send OTP");
    }
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    try {
      const response = await api.post("/auth/verify-otp", { email, otp });
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Invalid OTP");
    }
  },

  // Reset password with OTP
  resetPassword: async (email, otp, newPassword) => {
    try {
      const response = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to reset password");
    }
  },
};

export default authApi;
