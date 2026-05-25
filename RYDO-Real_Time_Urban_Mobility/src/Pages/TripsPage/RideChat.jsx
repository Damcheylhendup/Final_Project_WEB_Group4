import socket from "../../websocket/userRideSocket";
import { useEffect, useRef, useState } from "react";

function RideChat({ rideId, userName, role, onClose }) {

  const [input, setInput]               = useState("");
  const [messages, setMessages]         = useState([]);
  const [driverLocation, setDriverLocation] = useState(null);
  const [typingUser, setTypingUser]     = useState("");
  const typingTimerRef                  = useRef(null); // ← fix typing spam
  const bottomRef                       = useRef(null);

  /* =========================
     SOCKET SETUP
  ========================= */
  useEffect(() => {

    // ← Don't call socket.connect() here — already connected in parent
    // ← Join room directly, whether socket is connected or not
    const joinRoom = () => {
      socket.emit("join-ride", { rideId, role, userName });
      console.log("🚗 Joined ride room:", rideId);
    };

    // If already connected, join immediately
    if (socket.connected) {
      joinRoom();
    } else {
      // Otherwise wait for connection then join
      socket.once("connect", joinRoom);
    }

    /* CHAT HISTORY */
    socket.on("ride-history", (data) => {
      setMessages(data.messages || []);
      if (data.latestLocation) setDriverLocation(data.latestLocation);
    });

    /* NEW MESSAGE */
    socket.on("chat-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    /* LOCATION */
    socket.on("location-update", (location) => {
      setDriverLocation(location);
    });

    /* TYPING */
    socket.on("typing", (data) => {
      setTypingUser(`${data.userName} is typing...`);
    });

    socket.on("stop-typing", () => {
      setTypingUser("");
    });

    /* PARTICIPANT */
    socket.on("participant-joined", (data) => {
      console.log(`${data.userName} joined room`);
    });

    return () => {
      socket.off("connect",           joinRoom);
      socket.off("ride-history");
      socket.off("chat-message");
      socket.off("location-update");
      socket.off("participant-joined");
      socket.off("typing");
      socket.off("stop-typing");
    };

  }, [rideId, role, userName]);

  /* =========================
     DRIVER LIVE LOCATION
  ========================= */
  useEffect(() => {
    if (role !== "driver") return;

    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          socket.emit("update-location", {
            rideId,
            latitude:  position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => console.log("Location error:", err)
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [rideId, role]);

  /* =========================
     AUTO SCROLL
  ========================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================
     SEND MESSAGE
  ========================= */
  const handleSend = () => {
    if (!input.trim()) return;

    socket.emit("chat-message", { rideId, text: input });
    socket.emit("stop-typing",  { rideId });

    // Clear typing timer
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

    setInput("");
  };

  /* =========================
     TYPING — debounced
  ========================= */
  const handleTyping = (e) => {
    setInput(e.target.value);

    socket.emit("typing", { rideId, userName });

    // Clear previous timer, set new one
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      socket.emit("stop-typing", { rideId });
    }, 1000);
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999,
    }}>
      <div style={{
        background: "#fff", borderRadius: "16px",
        width: "100%", maxWidth: "460px", height: "80vh",
        display: "flex", flexDirection: "column",
        overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
      }}>

        {/* HEADER */}
        <div style={{
          background: "#f5a623", color: "#fff",
          padding: "1rem 1.2rem",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: "1rem" }}>
              🚗 {role === "driver" ? "Rider Chat" : "Driver Chat"}
            </div>
            <div style={{ fontSize: "0.78rem", opacity: 0.9 }}>
              Ride #{rideId} · {userName}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.25)", border: "none",
            color: "#fff", borderRadius: "50%",
            width: "30px", height: "30px", cursor: "pointer", fontSize: "1rem",
          }}>✕</button>
        </div>

        {/* DRIVER LOCATION */}
        {driverLocation && role !== "driver" && (
          <div style={{
            background: "#e3f2fd", padding: "0.45rem 1rem",
            fontSize: "0.82rem", color: "#1565c0",
          }}>
            📍 Driver location: {driverLocation.latitude?.toFixed(5)}, {driverLocation.longitude?.toFixed(5)}
          </div>
        )}

        {/* CHAT AREA */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: "1rem", background: "#f5f5f5",
        }}>
          {messages.length === 0 && (
            <p style={{ color: "#999", textAlign: "center", marginTop: "2rem" }}>
              No messages yet 👋
            </p>
          )}

          {messages.map((msg) => {
            const isMe = msg.userName === userName;
            return (
              <div key={msg.id} style={{ textAlign: isMe ? "right" : "left", marginBottom: "0.75rem" }}>
                <div style={{ fontSize: "0.72rem", color: "#888", marginBottom: "3px" }}>
                  {msg.userName} · {msg.role}
                </div>
                <div style={{
                  display: "inline-block",
                  background: isMe ? "#f5a623" : "#e0e0e0",
                  color: isMe ? "#fff" : "#333",
                  padding: "0.45rem 0.9rem",
                  borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  maxWidth: "75%",
                }}>
                  {msg.text}
                </div>
              </div>
            );
          })}

          {typingUser && (
            <p style={{ color: "#777", fontSize: "0.8rem", marginTop: "10px" }}>
              {typingUser}
            </p>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div style={{
          display: "flex", gap: "0.5rem",
          padding: "0.75rem 1rem",
          borderTop: "1px solid #eee", background: "#fff",
        }}>
          <input
            value={input}
            onChange={handleTyping}          // ← uses debounced handler
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            style={{
              flex: 1, padding: "0.55rem 1rem",
              borderRadius: "20px", border: "1px solid #ddd", outline: "none",
            }}
          />
          <button onClick={handleSend} style={{
            padding: "0.55rem 1.1rem",
            background: "#f5a623", color: "#fff",
            border: "none", borderRadius: "20px", cursor: "pointer",
          }}>
            Send
          </button>
        </div>

      </div>
    </div>
  );
}

export default RideChat;