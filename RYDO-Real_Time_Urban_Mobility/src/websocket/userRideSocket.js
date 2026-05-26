import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  autoConnect: true,
  transports: ["polling", "websocket"],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
socket.on("connect_error", (err) => console.error("❌ Socket error:", err.message));

export default socket;

