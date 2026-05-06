const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 4000;
const rideState = new Map();

// Create a plain HTTP server. Socket.IO will attach to it.
const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    // For development, allow all origins.
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Clients join a ride room and receive history/snapshots.
  socket.on('join-ride', ({ rideId, role = 'passenger', userName = 'Guest' }) => {
    if (!rideId) return;

    const room = String(rideId);
    socket.join(room);
    socket.data.rideId = room;
    socket.data.role = role;
    socket.data.userName = userName;

    if (!rideState.has(room)) {
      rideState.set(room, { messages: [], latestLocation: null });
    }

    const state = rideState.get(room);
    socket.emit('ride-history', {
      rideId: room,
      messages: state.messages,
      latestLocation: state.latestLocation,
    });

    io.to(room).emit('participant-joined', {
      userName,
      role,
      rideId: room,
      ts: Date.now(),
    });

    console.log(`Socket ${socket.id} joined ride room: ${room} as ${role}`);
  });

  // Driver (or passenger, for demo) sends location updates.
  socket.on('update-location', ({ rideId, latitude, longitude, heading }) => {
    if (!rideId) return;
    const room = String(rideId);
    if (!rideState.has(room)) {
      rideState.set(room, { messages: [], latestLocation: null });
    }

    const payload = {
      rideId: room,
      role: socket.data.role || 'passenger',
      userName: socket.data.userName || 'Guest',
      latitude,
      longitude,
      heading: typeof heading === 'number' ? heading : null,
      ts: Date.now(),
    };

    rideState.get(room).latestLocation = payload;
    io.to(room).emit('location-update', payload);
  });

  // Realtime chat inside a ride room.
  socket.on('chat-message', ({ rideId, text }) => {
    if (!rideId || !text || !text.trim()) return;

    const room = String(rideId);
    if (!rideState.has(room)) {
      rideState.set(room, { messages: [], latestLocation: null });
    }

    const message = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      rideId: room,
      text: text.trim(),
      role: socket.data.role || 'passenger',
      userName: socket.data.userName || 'Guest',
      ts: Date.now(),
    };

    const state = rideState.get(room);
    state.messages.push(message);
    if (state.messages.length > 100) {
      state.messages.shift();
    }

    io.to(room).emit('chat-message', message);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Rydo backend (Socket.IO) listening on port ${PORT}`);
});

