import { createSlice } from '@reduxjs/toolkit';

// Get initial cart from localStorage
const getInitialCart = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : { items: [], totalItems: 0, totalAmount: 0 };
};

// Calculate cart totals
const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { totalItems, totalAmount };
};

// Save cart to localStorage
const saveCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: getInitialCart(),
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingIndex = state.items.findIndex(item => item._id === product._id);

      if (existingIndex >= 0) {
        // Update quantity if item exists
        const newQuantity = state.items[existingIndex].quantity + quantity;
        // Don't exceed available stock
        state.items[existingIndex].quantity = Math.min(newQuantity, product.stock);
      } else {
        // Add new item
        state.items.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          image: product.image,
          stock: product.stock,
          category: product.category,
          quantity: Math.min(quantity, product.stock),
        });
      }

      // Recalculate totals
      const { totalItems, totalAmount } = calculateTotals(state.items);
      state.totalItems = totalItems;
      state.totalAmount = totalAmount;
      saveCart(state);
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item._id !== productId);
      
      const { totalItems, totalAmount } = calculateTotals(state.items);
      state.totalItems = totalItems;
      state.totalAmount = totalAmount;
      saveCart(state);
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item._id === productId);
      
      if (item) {
        // Ensure quantity is valid
        item.quantity = Math.max(1, Math.min(quantity, item.stock));
      }

      const { totalItems, totalAmount } = calculateTotals(state.items);
      state.totalItems = totalItems;
      state.totalAmount = totalAmount;
      saveCart(state);
    },

    incrementQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.items.find(item => item._id === productId);
      
      if (item && item.quantity < item.stock) {
        item.quantity += 1;
      }

      const { totalItems, totalAmount } = calculateTotals(state.items);
      state.totalItems = totalItems;
      state.totalAmount = totalAmount;
      saveCart(state);
    },

    decrementQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.items.find(item => item._id === productId);
      
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }

      const { totalItems, totalAmount } = calculateTotals(state.items);
      state.totalItems = totalItems;
      state.totalAmount = totalAmount;
      saveCart(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      localStorage.removeItem('cart');
    },

    // Update stock info when receiving real-time updates
    updateItemStock: (state, action) => {
      const { productId, stock } = action.payload;
      const item = state.items.find(item => item._id === productId);
      
      if (item) {
        item.stock = stock;
        // Adjust quantity if it exceeds new stock
        if (item.quantity > stock) {
          item.quantity = Math.max(0, stock);
        }
        // Remove item if stock is 0
        if (stock === 0) {
          state.items = state.items.filter(i => i._id !== productId);
        }
      }

      const { totalItems, totalAmount } = calculateTotals(state.items);
      state.totalItems = totalItems;
      state.totalAmount = totalAmount;
      saveCart(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  updateItemStock,
} = cartSlice.actions;

export default cartSlice.reducer;
