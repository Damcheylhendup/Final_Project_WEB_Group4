import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCar,
  FaMoneyBillWave,
  FaUser,
  FaUserCog,
  FaToggleOn,
  FaToggleOff,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import './DriverDashboardPage.css';

function DriverDashboardPage() {
  const navigate = useNavigate();

  const [isOnline, setIsOnline] = useState(false);
  const [currentRide, setCurrentRide] = useState(null);

  const driver = JSON.parse(localStorage.getItem('currentUser')) || {
    fullName: 'Driver',
    vehicleType: 'Taxi',
    vehicleNumber: 'Not set',
  };

  const rideRequests = [
    {
      id: 1,
      riderName: 'Sonam',
      pickup: 'CST Main Gate',
      destination: 'Phuentsholing Town',
      fare: 180,
      distance: 4,
    },
    {
      id: 2,
      riderName: 'Kinley',
      pickup: 'College Hostel',
      destination: 'Bus Terminal',
      fare: 220,
      distance: 6,
    },
    {
      id: 3,
      riderName: 'Damchey',
      pickup: 'Lower Market',
      destination: 'CST Campus',
      fare: 150,
      distance: 3,
    },
  ];

  const handleAcceptRide = (ride) => {
    setCurrentRide({
      ...ride,
      status: 'Accepted',
    });
  };

  const handleCompleteRide = () => {
    alert('Ride completed successfully');
    setCurrentRide(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div className="driver-page">
      <div className="driver-container">
        <header className="driver-header">
          <div className="driver-logo">
            <span className="yellow">RY</span>
            <span className="red">DO</span>
          </div>

          <div className="header-actions">
            <button
              className={isOnline ? 'status-btn online' : 'status-btn offline'}
              onClick={() => setIsOnline(!isOnline)}
            >
              {isOnline ? <FaToggleOn /> : <FaToggleOff />}
              {isOnline ? 'Online' : 'Offline'}
            </button>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <section className="driver-welcome">
          <div>
            <h1>Driver Dashboard</h1>
            <p>Welcome, {driver.fullName}. Manage rides and earnings here.</p>
          </div>

          <div className="driver-status-box">
            <p>Status</p>
            <h2>{isOnline ? 'Available' : 'Unavailable'}</h2>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <FaCar />
            <div>
              <h3>Vehicle</h3>
              <p>
                {driver.vehicleType || 'Taxi'} -{' '}
                {driver.vehicleNumber || 'Not set'}
              </p>
            </div>
          </div>

          <div className="stat-card">
            <FaMoneyBillWave />
            <div>
              <h3>Today’s Earnings</h3>
              <p>Nu. 550</p>
            </div>
          </div>

          <div className="stat-card">
            <FaUser />
            <div>
              <h3>Total Trips</h3>
              <p>8 completed</p>
            </div>
          </div>

          <div className="stat-card clickable-card" onClick={() => navigate('/account')}>
            <FaUserCog />
            <div>
              <h3>Account & Settings</h3>
              <p>Manage profile and preferences</p>
            </div>
          </div>
        </section>

        <section className="driver-grid">
          <div className="driver-card">
            <h2>Available Ride Requests</h2>

            {!isOnline ? (
              <div className="offline-box">
                <p>You are offline. Go online to receive ride requests.</p>
              </div>
            ) : currentRide ? (
              <div className="offline-box">
                <p>You already have an active ride.</p>
              </div>
            ) : (
              <div className="requests-list">
                {rideRequests.map((ride) => (
                  <div className="request-card" key={ride.id}>
                    <div className="request-top">
                      <h3>{ride.riderName}</h3>
                      <span>Nu. {ride.fare}</span>
                    </div>

                    <p>
                      <FaMapMarkerAlt /> <strong>Pickup:</strong> {ride.pickup}
                    </p>

                    <p>
                      <FaMapMarkerAlt /> <strong>Destination:</strong>{' '}
                      {ride.destination}
                    </p>

                    <p>
                      <strong>Distance:</strong> {ride.distance} km
                    </p>

                    <button onClick={() => handleAcceptRide(ride)}>
                      Accept Ride
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="driver-card">
            <h2>Current Ride</h2>

            {currentRide ? (
              <div className="current-ride">
                <h3>{currentRide.riderName}</h3>
                <p>
                  <strong>Pickup:</strong> {currentRide.pickup}
                </p>
                <p>
                  <strong>Destination:</strong> {currentRide.destination}
                </p>
                <p>
                  <strong>Fare:</strong> Nu. {currentRide.fare}
                </p>
                <p>
                  <strong>Status:</strong> {currentRide.status}
                </p>

                <button onClick={handleCompleteRide}>Complete Ride</button>
              </div>
            ) : (
              <div className="offline-box">
                <p>No active ride yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DriverDashboardPage;