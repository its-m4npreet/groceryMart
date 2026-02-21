import axios from "axios";
import axiosRetry from "axios-retry";
import { API_BASE_URL } from "../config/constants";
import { secureRemoveItem } from "../utils/secureStorage";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Configure retry strategy
axiosRetry(api, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 2000; // time interval between retries
  },
  retryCondition: (error) => {
    // Retry on network errors and 5xx responses or timeouts
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === 'ECONNABORTED';
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, config } = error;

    // Handle 401 Unauthorized
    if (response?.status === 401) {
      const isVerifyTokenRequest = config?.url?.includes("/auth/verify");
      const isPublicAuthRoute =
        config?.url?.includes("/auth/forgot-password") ||
        config?.url?.includes("/auth/verify-otp") ||
        config?.url?.includes("/auth/reset-password") ||
        config?.url?.includes("/auth/signin") ||
        config?.url?.includes("/auth/signup");

      // Only clear session if it's not a verify token request or public auth route
      // Let the checkAuth action handle its own 401 errors
      if (!isVerifyTokenRequest && !isPublicAuthRoute) {
        // Clear storage (token plain, user encrypted)
        localStorage.removeItem("token");
        secureRemoveItem("user");
        localStorage.removeItem("tokenTimestamp");

        // Don't redirect if already on auth pages
        if (
          !window.location.pathname.includes("/login") &&
          !window.location.pathname.includes("/signup") &&
          !window.location.pathname.includes("/forgot-password")
        ) {
          window.location.href = "/login";
        }
      }
    }

    // Extract error message
    const message =
      response?.data?.message ||
      response?.data?.error ||
      error.message ||
      "Something went wrong";

    return Promise.reject({ ...error, message });
  },
);

export default api;
