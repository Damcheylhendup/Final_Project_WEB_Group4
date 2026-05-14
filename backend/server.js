const express = require('express');

const cors = require('cors');

const dotenv = require('dotenv');

const http = require('http');

const { Server } =
  require('socket.io');

const path = require('path');

const sequelize =
  require('./config/db');

/* ENV */
dotenv.config();

/* ROUTES */
const authRoutes =
  require('./routes/authRoutes');

const rideRoutes =
  require('./routes/rideRoutes');

const paymentRoutes =
  require('./routes/paymentRoutes');

/* APP */
const app = express();

const PORT =
  process.env.PORT || 4000;

/* SOCKET MEMORY STATE */
const rideState =
  new Map();

/* MIDDLEWARE */
app.use(
  cors({
    origin: '*',

    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
    ],
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* STATIC UPLOADS */
app.use(
  '/uploads',
  express.static(
    path.join(
      __dirname,
      'uploads'
    )
  )
);

/* TEST ROUTE */
app.get('/', (req, res) => {
  res.json({
    message:
      'Rydo Backend Running',
  });
});

/* API ROUTES */
app.use(
  '/api/auth',
  authRoutes
);

app.use(
  '/api/rides',
  rideRoutes
);

app.use(
  '/api/payments',
  paymentRoutes
);

/* HTTP SERVER */
const httpServer =
  http.createServer(app);

/* SOCKET.IO */
const io = new Server(
  httpServer,
  {
    cors: {
      origin: '*',

      methods: [
        'GET',
        'POST',
      ],
    },
  }
);

/* SOCKET CONNECTION */
io.on(
  'connection',
  (socket) => {
    console.log(
      `Socket connected: ${socket.id}`
    );

    /* JOIN RIDE ROOM */
    socket.on(
      'join-ride',
      ({
        rideId,
        role = 'passenger',
        userName = 'Guest',
      }) => {
        if (!rideId)
          return;

        const room =
          String(rideId);

        socket.join(room);

        socket.data.rideId =
          room;

        socket.data.role =
          role;

        socket.data.userName =
          userName;

        /* INIT ROOM */
        if (
          !rideState.has(room)
        ) {
          rideState.set(room, {
            messages: [],

            latestLocation:
              null,
          });
        }

        const state =
          rideState.get(room);

        /* SEND HISTORY */
        socket.emit(
          'ride-history',
          {
            rideId: room,

            messages:
              state.messages,

            latestLocation:
              state.latestLocation,
          }
        );

        /* BROADCAST JOIN */
        io.to(room).emit(
          'participant-joined',
          {
            userName,

            role,

            rideId: room,

            ts: Date.now(),
          }
        );

        console.log(
          `${userName} joined room ${room}`
        );
      }
    );

    /* LOCATION UPDATE */
    socket.on(
      'update-location',
      ({
        rideId,
        latitude,
        longitude,
        heading,
      }) => {
        if (!rideId)
          return;

        const room =
          String(rideId);

        if (
          !rideState.has(room)
        ) {
          rideState.set(room, {
            messages: [],

            latestLocation:
              null,
          });
        }

        const payload = {
          rideId: room,

          role:
            socket.data
              .role ||
            'passenger',

          userName:
            socket.data
              .userName ||
            'Guest',

          latitude,

          longitude,

          heading:
            typeof heading ===
            'number'
              ? heading
              : null,

          ts: Date.now(),
        };

        rideState.get(
          room
        ).latestLocation =
          payload;

        io.to(room).emit(
          'location-update',
          payload
        );
      }
    );

    /* CHAT */
    socket.on(
      'chat-message',
      ({
        rideId,
        text,
      }) => {
        if (
          !rideId ||
          !text ||
          !text.trim()
        )
          return;

        const room =
          String(rideId);

        if (
          !rideState.has(room)
        ) {
          rideState.set(room, {
            messages: [],

            latestLocation:
              null,
          });
        }

        const message = {
          id: `${Date.now()}-${Math.random()
            .toString(16)
            .slice(2, 8)}`,

          rideId: room,

          text: text.trim(),

          role:
            socket.data
              .role ||
            'passenger',

          userName:
            socket.data
              .userName ||
            'Guest',

          ts: Date.now(),
        };

        const state =
          rideState.get(room);

        state.messages.push(
          message
        );

        /* LIMIT CHAT */
        if (
          state.messages
            .length > 100
        ) {
          state.messages.shift();
        }

        io.to(room).emit(
          'chat-message',
          message
        );
      }
    );

    /* DISCONNECT */
    socket.on(
      'disconnect',
      () => {
        console.log(
          `Socket disconnected: ${socket.id}`
        );
      }
    );
  }
);

/* DATABASE CONNECTION */
sequelize
  .authenticate()
  .then(() => {
    console.log(
      'MySQL Connected Successfully'
    );

    httpServer.listen(
      PORT,
      () => {
        console.log(
          `Rydo backend running on port ${PORT}`
        );
      }
    );
  })
  .catch((err) => {
    console.log(
      'Database connection failed'
    );

    console.log(err);
  });