const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

/**
 * Initialize Socket.io with the HTTP server
 * @param {Object} httpServer - HTTP server instance
 * @returns {Object} Socket.io instance
 */
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL ,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Authentication middleware for Socket.io
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        // Allow connection without auth for public events (product updates)
        socket.user = null;
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded.user;
      next();
    } catch (error) {
      // Allow connection but mark as unauthenticated
      socket.user = null;
      next();
    }
  });

  // Handle socket connections
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join user-specific room if authenticated
    if (socket.user) {
      socket.join(`user:${socket.user.id}`);
      console.log(`User ${socket.user.id} joined their room`);

      // Join admin room if user is admin
      if (socket.user.role === 'admin') {
        socket.join('admin');
        console.log(`✅ Admin ${socket.user.id} automatically joined admin room`);
      }
    } else {
      console.log(`Socket ${socket.id} connected without authentication`);
    }

    // Handle joining rooms
    socket.on('join-room', (room) => {
      if (socket.user) {
        socket.join(room);
        console.log(`Socket ${socket.id} joined room: ${room}`);
      }
    });

    // Handle leaving rooms
    socket.on('leave-room', (room) => {
      socket.leave(room);
      console.log(`Socket ${socket.id} left room: ${room}`);
    });

    // Handle admin joining admin room explicitly
    socket.on('join-admin', () => {
      console.log(`🔔 Join-admin request from socket ${socket.id}, user:`, socket.user);
      if (socket.user && socket.user.role === 'admin') {
        socket.join('admin');
        socket.emit('admin-joined', { message: 'Joined admin room' });
        console.log(`✅ Admin ${socket.user.id} explicitly joined admin room via join-admin event`);
      } else {
        socket.emit('error', { message: 'Unauthorized to join admin room' });
        console.log(`❌ Unauthorized join-admin attempt from socket ${socket.id}`);
      }
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${socket.id}, reason: ${reason}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error: ${socket.id}`, error);
    });
  });

  return io;
};

/**
 * Get the Socket.io instance
 * @returns {Object} Socket.io instance
 */
const getIO = () => {
  if (!io) {
    console.warn('Socket.io not initialized');
    return null;
  }
  return io;
};

/**
 * Emit event to all connected clients
 * @param {String} event - Event name
 * @param {Object} data - Event data
 */
const emitToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

/**
 * Emit event to specific room
 * @param {String} room - Room name
 * @param {String} event - Event name
 * @param {Object} data - Event data
 */
const emitToRoom = (room, event, data) => {
  if (io) {
    io.to(room).emit(event, data);
  }
};

/**
 * Emit event to specific user
 * @param {String} userId - User ID
 * @param {String} event - Event name
 * @param {Object} data - Event data
 */
const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

/**
 * Emit event to admin room
 * @param {String} event - Event name
 * @param {Object} data - Event data
 */
const emitToAdmin = (event, data) => {
  if (io) {
    io.to('admin').emit(event, data);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitToAll,
  emitToRoom,
  emitToUser,
  emitToAdmin,
};
