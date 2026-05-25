require('dotenv').config();

require('./models/User');
require('./models/Driver');
require('./models/Booking');
require('./models/ChatMessage');

const express = require('express');
const cors    = require('cors');
const http    = require('http');
const { Server } = require('socket.io');
const path    = require('path');

const sequelize = require('./config/db');

/* ROUTES */
const authRoutes    = require('./routes/authRoutes');
const rideRoutes    = require('./routes/rideRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

/* MODEL */
const ChatMessage = require('./models/ChatMessage');

const app  = express();
const PORT = process.env.PORT || 4000;

/* =========================
   MEMORY STORE
========================= */
const rideState = new Map();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors({
  origin: 'http://localhost:5173',   // ← exact origin, not '*'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,                 // ← required for socket handshake
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* STATIC FILES */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* TEST ROUTE */
app.get('/', (req, res) => {
  res.json({ success: true, message: '🚗 RYDO Backend Running' });
});

/* API ROUTES */
app.use('/api/auth',     authRoutes);
app.use('/api/rides',    rideRoutes);
app.use('/api/payments', paymentRoutes);

/* HTTP SERVER */
const httpServer = http.createServer(app);

/* =========================
   SOCKET.IO
========================= */
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',  // ← exact origin, not '*'
    methods: ['GET', 'POST'],
    credentials: true,                // ← required
  },
  pingInterval: 25000,
  pingTimeout:  60000,
  transports: ['polling', 'websocket'], // ← polling FIRST, then upgrades to websocket
});

/* =========================
   ENGINE DEBUG
========================= */
io.engine.on('connection_error', (err) => {
  console.log('❌ ENGINE ERROR CODE:   ', err.code);
  console.log('❌ ENGINE ERROR MSG:    ', err.message);
  console.log('❌ ENGINE ERROR CONTEXT:', err.context);
});

/* =========================
   SOCKET CONNECTION
========================= */
io.on('connection', (socket) => {

  console.log(`🟢 SOCKET CONNECTED: ${socket.id}`);

  /* =========================
     JOIN RIDE ROOM
  ========================= */
  socket.on('join-ride', async ({ rideId, role, userName }) => {
    try {
      if (!rideId) {
        console.log('⚠️ join-ride missing rideId');
        return;
      }

      const room = String(rideId);

      socket.join(room);
      socket.data.rideId    = room;
      socket.data.role      = role     || 'passenger';
      socket.data.userName  = userName || 'Guest';

      console.log(`🚗 ${socket.data.userName} (${socket.data.role}) joined room ${room}`);

      if (!rideState.has(room)) {
        rideState.set(room, { messages: [], latestLocation: null });
      }

      /* CONFIRM JOIN */
      socket.emit('join-success', { rideId: room, status: 'joined' });

      /* CHAT HISTORY */
      const oldMessages = await ChatMessage.findAll({
        where: { ride_id: room },
        order: [['createdAt', 'ASC']],
      });

      const formatted = oldMessages.map((msg) => ({
        id:       msg.id,
        rideId:   msg.ride_id,
        text:     msg.message,
        role:     msg.sender_role,
        userName: msg.sender_name,
        ts:       new Date(msg.createdAt).getTime(),
      }));

      rideState.get(room).messages = formatted;

      socket.emit('ride-history', {
        rideId,
        messages:       formatted,
        latestLocation: rideState.get(room).latestLocation,
      });

      io.to(room).emit('participant-joined', {
        rideId,
        role:     socket.data.role,
        userName: socket.data.userName,
        ts:       Date.now(),
      });

    } catch (err) {
      console.log('❌ join error:', err.message);
    }
  });

  /* =========================
     LIVE LOCATION
  ========================= */
  socket.on('update-location', (data) => {
    try {
      const { rideId, latitude, longitude, heading } = data;
      if (!rideId) return;

      const room = String(rideId);

      if (!rideState.has(room)) {
        rideState.set(room, { messages: [], latestLocation: null });
      }

      const prev = rideState.get(room).latestLocation;

      const payload = {
        rideId,
        latitude,
        longitude,
        heading:  typeof heading === 'number' ? heading : 0,
        role:     socket.data.role     || 'passenger',
        userName: socket.data.userName || 'Guest',
        ts:       Date.now(),
      };

      /* SMOOTH MOVEMENT */
      if (prev) {
        payload.latitude  = prev.latitude  * 0.7 + latitude  * 0.3;
        payload.longitude = prev.longitude * 0.7 + longitude * 0.3;
      }

      rideState.get(room).latestLocation = payload;

      io.to(room).emit('location-update', payload);

    } catch (err) {
      console.log('❌ location error:', err.message);
    }
  });

  /* =========================
     CHAT MESSAGE
  ========================= */
  socket.on('chat-message', async (data) => {
    try {
      const { rideId, text } = data;
      if (!rideId || !text?.trim()) return;

      const room = String(rideId);

      if (!rideState.has(room)) {
        rideState.set(room, { messages: [], latestLocation: null });
      }

      const message = {
        id:       `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        rideId:   room,
        text:     text.trim(),
        role:     socket.data.role     || 'passenger',
        userName: socket.data.userName || 'Guest',
        ts:       Date.now(),
      };

      await ChatMessage.create({
        ride_id:     room,
        sender_role: message.role,
        sender_name: message.userName,
        message:     message.text,
      });

      const state = rideState.get(room);
      state.messages.push(message);
      if (state.messages.length > 100) state.messages.shift();

      io.to(room).emit('chat-message', message);

    } catch (err) {
      console.log('❌ chat error:', err.message);
    }
  });

  /* =========================
     TYPING
  ========================= */
  socket.on('typing', ({ rideId, userName }) => {
    socket.to(String(rideId)).emit('typing', { userName });
  });

  socket.on('stop-typing', ({ rideId }) => {
    socket.to(String(rideId)).emit('stop-typing');
  });

  /* =========================
     RIDE STATUS
  ========================= */
  socket.on('ride-status-update', ({ rideId, status }) => {
    console.log(`📋 Status update room ${rideId}: ${status}`);
    io.to(String(rideId)).emit('ride-status-update', { rideId, status });
  });

  /* =========================
     DISCONNECT
  ========================= */
  socket.on('disconnect', (reason) => {
    const room = socket.data.rideId;

    console.log(`🔴 DISCONNECTED: ${socket.id} — reason: ${reason}`);

    if (room && rideState.has(room)) {
      setTimeout(() => {
        const clients = io.sockets.adapter.rooms.get(room);
        if (!clients || clients.size === 0) {
          rideState.delete(room);
          console.log(`🧹 Cleaned up room ${room}`);
        }
      }, 30000);
    }
  });
});

/* =========================
   START SERVER
========================= */
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database synced');
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:4000`);
    });
  })
  .catch((err) => {
    console.error('❌ DB error:', err.message);
  });
