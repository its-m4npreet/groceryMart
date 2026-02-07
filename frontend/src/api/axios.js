import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle 401 Unauthorized - Clear token and redirect
    if (response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't redirect if already on auth pages
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    
    // Extract error message
    const message = response?.data?.message || 
                    response?.data?.error || 
                    error.message || 
                    'Something went wrong';
    
    return Promise.reject({ ...error, message });
  }
);

export default api;
