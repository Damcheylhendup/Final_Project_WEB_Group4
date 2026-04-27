import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TripsPage.css';

function TripsPage() {
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const savedRides = JSON.parse(localStorage.getItem('rides')) || [];
    setRides(savedRides);
  }, []);

  const clearTrips = () => {
    localStorage.removeItem('rides');
    setRides([]);
  };

  return (
    <div className="trips-page">
      <div className="trips-container">
        <div className="trips-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>

          <h1>My Trips</h1>
          <p>View your current and past Rydo bookings.</p>
        </div>

        {rides.length === 0 ? (
          <div className="empty-box">
            <h2>No trips yet</h2>
            <p>Your booked rides will appear here.</p>
            <button onClick={() => navigate('/booking')}>Book a Ride</button>
          </div>
        ) : (
          <>
            <div className="trips-list">
              {rides.map((ride) => (
                <div className="trip-card" key={ride.id}>
                  <div className="trip-top">
                    <h2>{ride.rideType} Ride</h2>
                    <span className="status">{ride.status}</span>
                  </div>

                  <div className="trip-info">
                    <p><strong>Pickup:</strong> {ride.pickup}</p>
                    <p><strong>Destination:</strong> {ride.destination}</p>
                    <p><strong>Distance:</strong> {ride.distance} km</p>
                    <p><strong>Fare:</strong> Nu. {ride.fare}</p>
                    <p><strong>Date:</strong> {ride.date}</p>
                  </div>

                  <div className="trip-actions">
                    <button onClick={() => navigate('/map')}>Track Ride</button>
                    <button onClick={() => navigate('/payments')}>Pay Now</button>
                  </div>
                </div>
              ))}
            </div>

            <button className="clear-btn" onClick={clearTrips}>
              Clear Trip History
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TripsPage;