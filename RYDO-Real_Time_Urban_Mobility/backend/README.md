# Rydo Backend (Socket.IO)

## Where is the backend entry point?
- `backend/server.js`

This file starts an HTTP server and attaches Socket.IO to it. When a browser connects, the code inside:
- `io.on('connection', ...)`
runs and registers event handlers.

## How to run
1. Open a terminal in:
   - `RYDO-Real_Time_Urban_Mobility/backend`
2. Install dependencies:
   - `npm install`
3. Start the server:
   - `npm start`

By default it listens on port `4000` (`PORT` env var can override).

## Socket events (basic)
1. `join-ride` (client -> server)
   - payload: `{ rideId }`
   - server action: puts the socket into a room named by `rideId`

2. `update-location` (driver -> server)
   - payload: `{ rideId, latitude, longitude }`
   - server action: emits `driver-location` to everyone in that room

3. `driver-location` (server -> clients)
   - payload: `{ rideId, latitude, longitude, ts }`

