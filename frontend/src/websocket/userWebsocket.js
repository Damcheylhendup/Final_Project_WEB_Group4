import { io } from "socket.io-client";

const socket = io("https://rydo-backend.onrender.com");

export default socket;