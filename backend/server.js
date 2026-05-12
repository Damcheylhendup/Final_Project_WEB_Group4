const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const PORT = process.env.PORT || 4000;

const rideState = new Map();

/* EXPRESS APP */
const app = express();

app.use(cors());

app.use(express.json());

app.use('/uploads', express.static('uploads'));

/* TEST ROUTE */
app.get('/', (req, res) => {
  res.send('Rydo Backend Running');
});

/* API ROUTES */
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/payments', paymentRoutes);

/* HTTP SERVER */
const httpServer = http.createServer(app);

/* SOCKET SERVER */
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Join ride room
  socket.on(
    'join-ride',
    ({ rideId, role = 'passenger', userName = 'Guest' }) => {
      if (!rideId) return;

      const room = String(rideId);

      socket.join(room);

      socket.data.rideId = room;
      socket.data.role = role;
      socket.data.userName = userName;

      if (!rideState.has(room)) {
        rideState.set(room, {
          messages: [],
          latestLocation: null,
        });
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

      console.log(
        `Socket ${socket.id} joined ride room: ${room} as ${role}`
      );
    }
  );

  // Location updates
  socket.on(
    'update-location',
    ({ rideId, latitude, longitude, heading }) => {
      if (!rideId) return;

      const room = String(rideId);

      if (!rideState.has(room)) {
        rideState.set(room, {
          messages: [],
          latestLocation: null,
        });
      }

      const payload = {
        rideId: room,
        role: socket.data.role || 'passenger',
        userName: socket.data.userName || 'Guest',
        latitude,
        longitude,
        heading:
          typeof heading === 'number'
            ? heading
            : null,
        ts: Date.now(),
      };

      rideState.get(room).latestLocation =
        payload;

      io.to(room).emit(
        'location-update',
        payload
      );
    }
  );

  // Chat messages
  socket.on(
    'chat-message',
    ({ rideId, text }) => {
      if (!rideId || !text || !text.trim())
        return;

      const room = String(rideId);

      if (!rideState.has(room)) {
        rideState.set(room, {
          messages: [],
          latestLocation: null,
        });
      }

      const message = {
        id: `${Date.now()}-${Math.random()
          .toString(16)
          .slice(2, 8)}`,

        rideId: room,

        text: text.trim(),

        role:
          socket.data.role || 'passenger',

        userName:
          socket.data.userName || 'Guest',

        ts: Date.now(),
      };

      const state = rideState.get(room);

      state.messages.push(message);

      if (state.messages.length > 100) {
        state.messages.shift();
      }

      io.to(room).emit(
        'chat-message',
        message
      );
    }
  );

  socket.on('disconnect', () => {
    console.log(
      `Socket disconnected: ${socket.id}`
    );
  });
});

httpServer.listen(PORT, () => {
  console.log(
    `Rydo backend running on port ${PORT}`
  );
});