import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productApi } from '../../api';

const initialState = {
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  meta: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    inStock: false,
  },
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await productApi.getProducts(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productApi.getProductById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch product');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ query, params = {} }, { rejectWithValue }) => {
    try {
      const response = await productApi.searchProducts(query, params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to search products');
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async ({ category, params = {} }, { rejectWithValue }) => {
    try {
      const response = await productApi.getProductsByCategory(category, params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPage: (state, action) => {
      state.meta.page = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    // Real-time updates
    updateProductInList: (state, action) => {
      const updatedProduct = action.payload;
      const index = state.products.findIndex(p => p._id === updatedProduct._id);
      if (index >= 0) {
        state.products[index] = { ...state.products[index], ...updatedProduct };
      }
      if (state.currentProduct?._id === updatedProduct._id) {
        state.currentProduct = { ...state.currentProduct, ...updatedProduct };
      }
    },
    addProductToList: (state, action) => {
      state.products.unshift(action.payload);
      state.meta.total += 1;
    },
    removeProductFromList: (state, action) => {
      state.products = state.products.filter(p => p._id !== action.payload);
      state.meta.total -= 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload.data;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch by category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  resetFilters,
  setPage,
  clearCurrentProduct,
  updateProductInList,
  addProductToList,
  removeProductFromList,
} = productSlice.actions;

export default productSlice.reducer;
