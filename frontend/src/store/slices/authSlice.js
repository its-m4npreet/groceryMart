import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api';
import socketService from '../../services/socketService';

// Get initial state from localStorage
const getInitialState = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  return {
    user: user ? JSON.parse(user) : null,
    token: token || null,
    isAuthenticated: !!token,
    isLoading: false,
    error: null,
  };
};

// Async thunks
export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.signup(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Signup failed');
    }
  }
);

export const signin = createAsyncThunk(
  'auth/signin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.signin(credentials);
      // Store token and user in localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        // Connect socket with token
        socketService.connect(response.token);
        // Join admin room if admin
        if (response.user.role === 'admin') {
          socketService.joinAdmin();
        }
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Signin failed');
    }
  }
);

// Check auth state on app load
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyToken();
      // If verification is successful, connect socket
      const token = localStorage.getItem('token');
      if (token && response.user) {
        socketService.connect(token);
        if (response.user.role === 'admin') {
          socketService.joinAdmin();
        }
      }
      return response;
    } catch (error) {
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return rejectWithValue(error.message || 'Session expired');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Disconnect socket
      socketService.disconnect();
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Signin
      .addCase(signin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(signin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
