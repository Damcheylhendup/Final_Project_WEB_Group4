import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MapPage.css';

function MapPage() {
  const navigate = useNavigate();

  const [ride, setRide] = useState(null);
  const [driverPosition, setDriverPosition] = useState(12);
  const [trackingStatus, setTrackingStatus] = useState('Waiting for driver');

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const rides = JSON.parse(localStorage.getItem('rides')) || [];

    const userRides = rides.filter(
      (item) =>
        item.riderId === currentUser?.id ||
        item.riderName === currentUser?.fullName
    );

    const activeRide =
      userRides.find((item) => item.status === 'Accepted') ||
      userRides.find((item) => item.status === 'Pending') ||
      userRides[userRides.length - 1];

    setRide(activeRide || null);

    if (!activeRide) return;

    if (activeRide.status === 'Pending') {
      setTrackingStatus('Waiting for driver to accept your ride');
      return;
    }

    if (activeRide.status === 'Completed') {
      setDriverPosition(88);
      setTrackingStatus('Trip completed');
      return;
    }

    setTrackingStatus('Driver is on the way');

    const interval = setInterval(() => {
      setDriverPosition((prev) => {
        if (prev >= 88) {
          clearInterval(interval);
          setTrackingStatus('Driver has arrived');

          const allRides = JSON.parse(localStorage.getItem('rides')) || [];
          const updatedRides = allRides.map((item) =>
            item.id === activeRide.id
              ? {
                  ...item,
                  status: 'Arrived',
                }
              : item
          );

          localStorage.setItem('rides', JSON.stringify(updatedRides));
          return 88;
        }

        if (prev >= 70) {
          setTrackingStatus('Driver is nearby');
        } else if (prev >= 40) {
          setTrackingStatus('Driver is halfway there');
        } else {
          setTrackingStatus('Driver is on the way');
        }

        return prev + 4;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="map-page">
      <div className="map-container">
        <button className="back-btn" onClick={() => navigate('/trips')}>
          ← Back
        </button>

        <div className="map-header">
          <h1>Live Tracking</h1>
          <p>Track your driver in real time on a 2D map.</p>
        </div>

        {!ride ? (
          <div className="tracking-card">
            <h2>No active ride</h2>
            <p>Please book a ride first to start live tracking.</p>
            <button onClick={() => navigate('/booking')}>Book Ride</button>
          </div>
        ) : (
          <>
            <div className="map-box">
              <div className="map-grid"></div>

              <div className="road horizontal-road"></div>
              <div className="road vertical-road left-road"></div>
              <div className="road vertical-road right-road"></div>

              <div className="location pickup">
                <div className="marker">📍</div>
                <span>Pickup</span>
              </div>

              <div className="location destination">
                <div className="marker">🏁</div>
                <span>Destination</span>
              </div>

              <div
                className="driver-car"
                style={{ left: `${driverPosition}%` }}
              >
                🚗
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-top">
                <span>{trackingStatus}</span>
                <span>{Math.round(driverPosition)}%</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${driverPosition}%` }}
                ></div>
              </div>
            </div>

            <div className="tracking-card">
              <h2>{ride.rideType} Ride</h2>

              <p>
                <strong>Pickup:</strong> {ride.pickup}
              </p>

              <p>
                <strong>Destination:</strong> {ride.destination}
              </p>

              <p>
                <strong>Driver:</strong> {ride.driverName || 'Not assigned yet'}
              </p>

              <p>
                <strong>Status:</strong> {trackingStatus}
              </p>

              <p>
                <strong>Fare:</strong> Nu. {ride.fare}
              </p>

              <p>
                <strong>Payment:</strong> {ride.paymentStatus || 'Unpaid'}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MapPage;