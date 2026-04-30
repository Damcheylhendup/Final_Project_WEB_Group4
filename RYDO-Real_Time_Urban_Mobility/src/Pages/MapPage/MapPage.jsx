import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import './MapPage.css';

function MapPage() {
  const navigate = useNavigate();

  const [driverPosition, setDriverPosition] = useState(20);
  const [ride, setRide] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const BACKEND_URL = 'http://localhost:4000';

  useEffect(() => {
    const rides = JSON.parse(localStorage.getItem('rides')) || [];
    if (rides.length > 0) {
      setRide(rides[rides.length - 1]);
    }
  }, []);

  useEffect(() => {
    // No ride selected => nothing to track.
    if (!ride?.id) return;

    const socket = io(BACKEND_URL);
    setIsConnected(false);

    // Track-room simulation so you can test end-to-end without a separate driver app.
    let simPosition = 20; // percent along the road (0-100)
    const start = () => {
      socket.emit('join-ride', { rideId: ride.id });

      const interval = setInterval(() => {
        simPosition = Math.min(80, simPosition + 5);

        // Fake coordinates; backend just broadcasts them back.
        // We convert percent -> longitude so UI can reverse it.
        const latitude = 27.5 + simPosition / 200; // demo values
        const longitude = 89 + simPosition / 100; // so pos = (longitude - 89) * 100

        socket.emit('update-location', {
          rideId: ride.id,
          latitude,
          longitude,
        });
      }, 1000);

      // Cleanup interval when socket disconnects/unmounts.
      socket.on('disconnect', () => clearInterval(interval));
    };

    socket.on('connect', () => {
      setIsConnected(true);
      start();
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('driver-location', ({ longitude }) => {
      if (typeof longitude !== 'number') return;

      const pos = (longitude - 89) * 100;
      setDriverPosition(Math.max(0, Math.min(80, Math.round(pos))));
    });

    return () => {
      setIsConnected(false);
      socket.disconnect();
    };
  }, [ride?.id]);

  return (
    <div className="map-page">
      <div className="map-container">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back
        </button>

        <h1>Live Tracking</h1>
        <p className="subtitle">
          Track your driver in real time. {isConnected ? 'Connected to backend.' : 'Connecting...'}
        </p>

        <div className="map-box">
          <div className="road-line"></div>

          <div className="location pickup" style={{ left: '15%' }}>
            📍
            <span>Pickup</span>
          </div>

          <div className="location destination" style={{ left: '85%' }}>
            🏁
            <span>Destination</span>
          </div>

          <div className="driver" style={{ left: `${driverPosition}%` }}>
            🚗
          </div>
        </div>

        {ride ? (
          <div className="tracking-card">
            <h2>{ride.rideType} Ride</h2>
            <p><strong>Pickup:</strong> {ride.pickup}</p>
            <p><strong>Destination:</strong> {ride.destination}</p>
            <p><strong>Status:</strong> Driver is on the way</p>
          </div>
        ) : (
          <div className="tracking-card">
            <h2>No active ride</h2>
            <p>Please book a ride first.</p>
            <button onClick={() => navigate('/booking')}>Book Ride</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapPage;