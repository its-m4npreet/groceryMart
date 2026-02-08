import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: import.meta.env.DEV,
});

// Initialize auth state from localStorage after store creation
import { secureGetItem } from '../utils/secureStorage';
import { TOKEN_EXPIRE_MS } from '../config/constants';

const initializeAuthState = async () => {
  try {
    const token = localStorage.getItem("token");
    const tokenTimestamp = localStorage.getItem("tokenTimestamp");

    // Check if token is expired
    const isTokenExpired = tokenTimestamp
      ? Date.now() - parseInt(tokenTimestamp) > TOKEN_EXPIRE_MS
      : false;

    if (token && !isTokenExpired) {
      const user = await secureGetItem("user");
      if (user) {
        // Update the store with the loaded user data
        store.dispatch({ 
          type: 'auth/loadUserFromStorage', 
          payload: { user, token } 
        });
      }
    }
  } catch (error) {
    console.error("Error initializing auth state:", error);
  }
};

// Run initialization
initializeAuthState();

export default store;
