const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 4000;

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

  // Clients can join a “ride room” so updates are sent to the right trip only.
  socket.on('join-ride', ({ rideId }) => {
    if (!rideId) return;
    socket.join(String(rideId));
    console.log(`Socket ${socket.id} joined ride room: ${rideId}`);
  });

  // Driver sends location updates for a ride; server forwards to everyone in that ride room.
  socket.on('update-location', ({ rideId, latitude, longitude }) => {
    if (!rideId) return;
    io.to(String(rideId)).emit('driver-location', {
      rideId: String(rideId),
      latitude,
      longitude,
      ts: Date.now(),
    });
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Rydo backend (Socket.IO) listening on port ${PORT}`);
});

