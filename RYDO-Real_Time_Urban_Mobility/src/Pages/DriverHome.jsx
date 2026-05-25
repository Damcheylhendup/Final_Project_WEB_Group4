import { useEffect } from "react";
import { socket } from "../socket";

export default function DriverHome() {

  useEffect(() => {

    socket.connect();

    socket.on("connect", () => {
      console.log("🟢 Driver socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Driver socket disconnected");
    });

    return () => socket.disconnect();

  }, []);

  return <h1>Driver Dashboard</h1>;
}