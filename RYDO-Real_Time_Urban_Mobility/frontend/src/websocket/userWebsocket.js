import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://rydo-qvem.onrender.com";

const socket = io(SOCKET_URL);

export default socket;