import { io } from "socket.io-client";

export const socket = io("http://localhost:4000", {
  autoConnect: true,           // ← was false, socket never started
  transports: ["polling", "websocket"],  // ← polling first, then upgrades
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => console.log("✅ Connected:", socket.id));
socket.on("connect_error", (err) => console.error("❌ Error:", err.message));