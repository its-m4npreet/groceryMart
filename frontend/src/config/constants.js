// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Product Categories
export const CATEGORIES = [
  { id: 'fruits', name: 'Fresh Fruits', icon: '🍎', color: 'bg-red-100' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥬', color: 'bg-green-100' },
  { id: 'grocery', name: 'Grocery', icon: '🛒', color: 'bg-amber-100' },
];

// Product Units
export const UNITS = ['kg', 'g', 'piece', 'dozen', 'pack', 'liter', 'ml'];

// Order Statuses
export const ORDER_STATUSES = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: '✓' },
  packed: { label: 'Packed', color: 'bg-indigo-100 text-indigo-800', icon: '📦' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: '🚚' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: '✅' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: '❌' },
};

// Payment Methods
export const PAYMENT_METHODS = [
  { id: 'cod', name: 'Cash on Delivery', icon: '💵' },
  { id: 'online', name: 'Online Payment', icon: '💳' },
];

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const PAGE_SIZE_OPTIONS = [12, 24, 48];

// Image Placeholders
export const PLACEHOLDER_PRODUCT_IMAGE = '/images/placeholder-product.png';
export const PLACEHOLDER_USER_AVATAR = '/images/placeholder-avatar.png';

// Socket Events
export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  JOIN_ADMIN: 'join-admin',
  ADMIN_JOINED: 'admin-joined',
  PRODUCT_CREATED: 'product-created',
  PRODUCT_UPDATED: 'product-updated',
  PRODUCT_DELETED: 'product-deleted',
  NEW_ORDER: 'new-order',
  ORDER_STATUS_UPDATED: 'order-status-updated',
  ORDER_CANCELLED: 'order-cancelled',
};
