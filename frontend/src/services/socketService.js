import { io } from 'socket.io-client';
import { SOCKET_URL, SOCKET_EVENTS } from '../config/constants';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  // Connect to socket server
  connect(token = null) {
    if (this.socket?.connected) {
      return this.socket;
    }

    const options = {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    };

    // Add auth token if available
    if (token) {
      options.auth = { token };
    }

    this.socket = io(SOCKET_URL, options);

    // Setup connection event handlers
    this.socket.on(SOCKET_EVENTS.CONNECT, () => {
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on(SOCKET_EVENTS.ERROR, (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  // Disconnect from socket server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }

  // Check if connected
  isConnected() {
    return this.socket?.connected ?? false;
  }

  // Join a room
  joinRoom(room) {
    if (this.socket) {
      this.socket.emit(SOCKET_EVENTS.JOIN_ROOM, room);
    }
  }

  // Leave a room
  leaveRoom(room) {
    if (this.socket) {
      this.socket.emit(SOCKET_EVENTS.LEAVE_ROOM, room);
    }
  }

  // Join admin room
  joinAdmin() {
    if (this.socket) {
      this.socket.emit(SOCKET_EVENTS.JOIN_ADMIN);
    }
  }

  // Subscribe to an event
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      
      // Track listener for cleanup
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
    }
  }

  // Unsubscribe from an event
  off(event, callback) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
        const callbacks = this.listeners.get(event);
        if (callbacks) {
          const index = callbacks.indexOf(callback);
          if (index > -1) {
            callbacks.splice(index, 1);
          }
        }
      } else {
        // Remove all listeners for this event
        this.socket.off(event);
        this.listeners.delete(event);
      }
    }
  }

  // Emit an event
  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // Subscribe to product updates
  onProductUpdate(callback) {
    this.on(SOCKET_EVENTS.PRODUCT_UPDATED, callback);
  }

  // Subscribe to product created
  onProductCreated(callback) {
    this.on(SOCKET_EVENTS.PRODUCT_CREATED, callback);
  }

  // Subscribe to product deleted
  onProductDeleted(callback) {
    this.on(SOCKET_EVENTS.PRODUCT_DELETED, callback);
  }

  // Subscribe to new orders (admin)
  onNewOrder(callback) {
    this.on(SOCKET_EVENTS.NEW_ORDER, callback);
  }

  // Subscribe to order status updates
  onOrderStatusUpdate(callback) {
    this.on(SOCKET_EVENTS.ORDER_STATUS_UPDATED, callback);
  }

  // Subscribe to order cancellation
  onOrderCancelled(callback) {
    this.on(SOCKET_EVENTS.ORDER_CANCELLED, callback);
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
