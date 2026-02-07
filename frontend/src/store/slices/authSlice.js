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
const getInitialState = () => {
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

    // Return initial state with token
    // User will be loaded via checkAuth which properly decrypts data
    return {
      user: null,
      token: token || null,
      isAuthenticated: !!token,
      isLoading: !!token, // Set loading true if we have token to trigger checkAuth
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
  initialState: getInitialState(),
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

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
