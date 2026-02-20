import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../api";
import socketService from "../../services/socketService";
import {
  secureSetItem,
  secureGetItem,
  secureRemoveItem,
} from "../../utils/secureStorage";
import { TOKEN_EXPIRE_MS } from "../../config/constants";

// Get initial state from localStorage with encryption
const getInitialState = async () => {
  try {
    // Get token from plain localStorage (not encrypted for quick access)
    const token = localStorage.getItem("token");
    const tokenTimestamp = localStorage.getItem("tokenTimestamp");

    // Check if token is expired (using configured expiration time)
    const isTokenExpired = tokenTimestamp
      ? Date.now() - parseInt(tokenTimestamp) > TOKEN_EXPIRE_MS
      : false;

    // Clear expired token
    if (isTokenExpired && token) {
      localStorage.removeItem("token");
      secureRemoveItem("user");
      localStorage.removeItem("tokenTimestamp");
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    }

    // Get user from secure storage if token exists
    let user = null;
    if (token) {
      try {
        user = await secureGetItem("user");
      } catch (error) {
        console.error("Error loading user from storage:", error);
      }
    }

    // Return initial state with both token and user
    return {
      user: user,
      token: token || null,
      isAuthenticated: !!(token && user),
      isLoading: false,
      error: null,
    };
  } catch (error) {
    console.error("Error getting initial state:", error);
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    };
  }
};

// Create a promise that resolves with initial state
const initialStatePromise = getInitialState();
let resolvedInitialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Resolve the initial state synchronously for Redux
initialStatePromise.then((state) => {
  resolvedInitialState = state;
});

// Async thunks
export const signup = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.signup(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Signup failed");
    }
  },
);

export const signin = createAsyncThunk(
  "auth/signin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.signin(credentials);
      // Store token in plain localStorage for quick synchronous access
      // Store user and timestamp encrypted for security
      if (response.token) {
        localStorage.setItem("token", response.token); // Plain storage for quick access
        await secureSetItem("user", response.user); // Encrypted storage
        localStorage.setItem("tokenTimestamp", Date.now().toString()); // Plain storage
        // Connect socket with token
        socketService.connect(response.token);
        // Join admin room if admin
        if (response.user.role === "admin") {
          socketService.joinAdmin();
        }
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Signin failed");
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await authApi.forgotPassword(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to send reset link");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await authApi.resetPassword(token, password);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to reset password");
    }
  }
);

// Check auth state on app load
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      // First try to get user from encrypted storage
      const cachedUser = await secureGetItem("user");
      const token = localStorage.getItem("token"); // Token stored in plain localStorage

      // Verify token with backend
      const response = await authApi.verifyToken();

      // If verification is successful, connect socket
      if (token && response.user) {
        // Update user in localStorage in case there were any changes
        await secureSetItem("user", response.user);
        socketService.connect(token);
        if (response.user.role === "admin") {
          socketService.joinAdmin();
        }
        return response;
      }

      // If backend verification fails but we have cached user, use it
      if (cachedUser && token) {
        socketService.connect(token);
        if (cachedUser.role === "admin") {
          socketService.joinAdmin();
        }
        return { user: cachedUser, token };
      }

      throw new Error("No valid session");
    } catch (error) {
      // Clear invalid token with secure removal
      localStorage.removeItem("token");
      secureRemoveItem("user");
      localStorage.removeItem("tokenTimestamp");
      socketService.disconnect();
      return rejectWithValue(error.message || "Session expired");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: resolvedInitialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      // Remove data from storage (token plain, user encrypted)
      localStorage.removeItem("token");
      secureRemoveItem("user");
      localStorage.removeItem("tokenTimestamp");
      // Disconnect socket
      socketService.disconnect();
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      // Persist to localStorage with encryption
      secureSetItem("user", action.payload);
    },
    loadUserFromStorage: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
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
        // Don't set loading if we already have user data
        if (!state.user) {
          state.isLoading = true;
        }
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null; // Don't show error for expired sessions
      });
  },
});

export const { logout, clearError, setUser, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
