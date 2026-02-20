/**
 * Socket.io Event Types
 * Centralized event names for consistency
 * 
 * Naming Convention: kebab-case for production use
 */

const SOCKET_EVENTS = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',

  // Room events
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  JOIN_ADMIN: 'join-admin',
  ADMIN_JOINED: 'admin-joined',

  // Product events (emitted to all clients)
  PRODUCT_CREATED: 'product-created',
  PRODUCT_UPDATED: 'product-updated', // For stock, price, or any changes
  PRODUCT_DELETED: 'product-deleted',

  // Order events
  NEW_ORDER: 'new-order', // Emitted to admin
  ORDER_STATUS_UPDATED: 'order-status-updated', // Emitted to customer and admin
  ORDER_CANCELLED: 'order-cancelled',

  // Rider events
  RIDER_ASSIGNED: 'rider-assigned', // Customer notified when rider assigned
  ORDER_ASSIGNED: 'order-assigned', // Rider notified when order assigned
  DELIVERY_STATUS_UPDATED: 'delivery-status-updated', // Admin notified
  ACCOUNT_STATUS_CHANGED: 'account-status-changed', // Rider notified of account activation/deactivation
  RIDER_STATUS_CHANGED: 'rider-status-changed', // Admin notified
};

module.exports = SOCKET_EVENTS;
