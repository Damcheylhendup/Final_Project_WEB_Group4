import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MapPage.css';

function MapPage() {
  const navigate = useNavigate();

  const [driverPosition, setDriverPosition] = useState(20);
  const [ride, setRide] = useState(null);

  useEffect(() => {
    const rides = JSON.parse(localStorage.getItem('rides')) || [];
    if (rides.length > 0) {
      setRide(rides[rides.length - 1]);
    }

    const interval = setInterval(() => {
      setDriverPosition((prev) => {
        if (prev >= 80) return 80;
        return prev + 5;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="map-page">
      <div className="map-container">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back
        </button>

        <h1>Live Tracking</h1>
        <p className="subtitle">Track your driver in real time.</p>

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