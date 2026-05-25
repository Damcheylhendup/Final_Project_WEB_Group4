import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCar, FaMoneyBillWave, FaUser,
  FaUserCog, FaToggleOn, FaToggleOff, FaMapMarkerAlt,
} from 'react-icons/fa';

import {
  getPendingRides, acceptRide, getMyRides,
  verifyPayment, rejectPayment,
} from '../../api/rideApi';

import RideChat from '../TripsPage/RideChat';
import socket from '../../websocket/userRideSocket'; // ← IMPORT SOCKET
import './DriverDashboardPage.css';

function DriverDashboardPage() {
  const navigate = useNavigate();

  const [isOnline, setIsOnline]     = useState(false);
  const [currentRide, setCurrentRide] = useState(null);
  const [rideRequests, setRideRequests] = useState([]);
  const [driverRides, setDriverRides]   = useState([]);
  const [chatOpen, setChatOpen]         = useState(false);

  const driver     = JSON.parse(localStorage.getItem('currentUser')) || {};
  const driverName = driver.fullName || driver.email || 'Driver';

  /* =========================
     SOCKET SETUP
  ========================= */
  useEffect(() => {
    // Confirm socket is alive
    if (!socket.connected) socket.connect();

    socket.on('ride-status-update', ({ rideId, status }) => {
      setCurrentRide((prev) =>
        prev && String(prev.id) === String(rideId)
          ? { ...prev, status }
          : prev
      );
    });

    socket.on('participant-joined', ({ userName, role }) => {
      console.log(`${role} ${userName} joined the ride room`);
    });

    return () => {
      socket.off('ride-status-update');
      socket.off('participant-joined');
    };
  }, []);

  /* =========================
     JOIN RIDE ROOM when currentRide changes
  ========================= */
  useEffect(() => {
    if (!currentRide) return;

    socket.emit('join-ride', {
      rideId: String(currentRide.id),
      role: 'driver',
      userName: driverName,
    });

    console.log('🚗 Driver joined ride room:', currentRide.id);
  }, [currentRide?.id]);

  /* =========================
     LOAD PENDING RIDES
  ========================= */
  const loadRideRequests = async () => {
    try {
      const response = await getPendingRides();
      setRideRequests(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  /* =========================
     LOAD DRIVER RIDES
  ========================= */
  const loadDriverRides = async () => {
    try {
      const response = await getMyRides();
      const rides    = response.data || [];

      setDriverRides(rides);

      const activeRide = rides.find((ride) =>
        ['Accepted', 'Driver Arriving', 'Ongoing'].includes(ride.status)
      );

      if (activeRide) setCurrentRide(activeRide);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadRideRequests();
    loadDriverRides();
  }, []);

  /* =========================
     ACCEPT RIDE
  ========================= */
  const handleAcceptRide = async (ride) => {
    try {
      const response = await acceptRide(ride.id || ride.booking_id);
      alert(response.data.message);
      setCurrentRide(response.data.ride);
      loadRideRequests();
      loadDriverRides();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to accept ride');
    }
  };

  /* =========================
     VERIFY / REJECT PAYMENT
  ========================= */
  const handleVerifyPayment = async (rideId) => {
    try {
      const response = await verifyPayment(rideId);
      alert(response.data.message);
      loadDriverRides();
    } catch (error) {
      alert(error.response?.data?.message || 'Verification failed');
    }
  };

  const handleRejectPayment = async (rideId) => {
    try {
      const response = await rejectPayment(rideId);
      alert(response.data.message);
      loadDriverRides();
    } catch (error) {
      alert(error.response?.data?.message || 'Rejection failed');
    }
  };

  /* =========================
     UPDATE STATUS — now emits to socket
  ========================= */
  const updateRideStatus = (status) => {
    if (!currentRide) return;

    // ← Tell all clients in this ride room
    socket.emit('ride-status-update', {
      rideId: String(currentRide.id),
      status,
    });

    setCurrentRide((prev) => ({ ...prev, status }));
  };

  /* =========================
     COMPLETE RIDE
  ========================= */
  const completeRide = () => {
    updateRideStatus('Completed');
    alert('Ride completed successfully');
    setCurrentRide(null);
    setChatOpen(false);
  };

  /* =========================
     CANCEL RIDE
  ========================= */
  const cancelRide = () => {
    updateRideStatus('Cancelled');
    alert('Ride cancelled');
    setCurrentRide(null);
    setChatOpen(false);
  };

  /* =========================
     LOGOUT
  ========================= */
  const handleLogout = () => {
    socket.disconnect(); // ← clean disconnect
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    navigate('/login');
  };

  /* =========================
     TOTAL EARNINGS
  ========================= */
  const totalEarnings = driverRides.reduce(
    (total, ride) => total + Number(ride.fare || 0), 0
  );

  return (
    <div className="driver-page">
      <div className="driver-container">

        {/* HEADER */}
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
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        {/* WELCOME */}
        <section className="driver-welcome">
          <div>
            <h1>Driver Dashboard</h1>
            <p>Welcome, {driverName}</p>
          </div>
          <div className="driver-status-box">
            <p>Status</p>
            <h2>{isOnline ? 'Available' : 'Unavailable'}</h2>
          </div>
        </section>

        {/* STATS */}
        <section className="stats-grid">
          <div className="stat-card">
            <FaCar />
            <div>
              <h3>Vehicle</h3>
              <p>{driver.vehicleType || 'Taxi'} - {driver.vehicleNumber || 'Not set'}</p>
            </div>
          </div>
          <div className="stat-card earnings-card">
            <FaMoneyBillWave />
            <div>
              <h3>Total Earnings</h3>
              <p>Nu. {totalEarnings}</p>
            </div>
          </div>
          <div className="stat-card">
            <FaUser />
            <div>
              <h3>Total Trips</h3>
              <p>{driverRides.length} rides</p>
            </div>
          </div>
          <div className="stat-card clickable-card" onClick={() => navigate('/account')}>
            <FaUserCog />
            <div>
              <h3>Account & Settings</h3>
              <p>Manage profile</p>
            </div>
          </div>
        </section>

        {/* ACTIVE RIDE */}
        {currentRide && (
          <div className="active-ride-card">
            <div className="active-top">
              <div>
                <h2>Active Ride</h2>
                <p>{currentRide.riderName}</p>
              </div>
              <span className="ride-status-badge">{currentRide.status}</span>
            </div>
            <div className="active-details">
              <p><strong>Pickup:</strong> {currentRide.pickup}</p>
              <p><strong>Destination:</strong> {currentRide.destination}</p>
              <p><strong>Fare:</strong> Nu. {currentRide.fare}</p>
            </div>
            <div className="ride-progress-buttons">
              <button onClick={() => updateRideStatus('Driver Arriving')}>Driver Arriving</button>
              <button onClick={() => updateRideStatus('Ongoing')}>Start Trip</button>
              <button onClick={() => navigate('/map')}>Track Ride</button>
              <button onClick={() => setChatOpen(true)}>💬 Chat</button>
              <button className="complete-btn" onClick={completeRide}>Complete</button>
              <button className="cancel-btn" onClick={cancelRide}>Cancel</button>
            </div>
          </div>
        )}

        {/* MAIN GRID */}
        <section className="driver-grid">
          {/* RIDE REQUESTS */}
          <div className="driver-card">
            <h2>Available Ride Requests</h2>
            {!isOnline ? (
              <div className="offline-box"><p>You are offline.</p></div>
            ) : currentRide ? (
              <div className="offline-box"><p>Active ride in progress.</p></div>
            ) : rideRequests.length === 0 ? (
              <div className="offline-box"><p>No pending rides.</p></div>
            ) : (
              <div className="requests-list">
                {rideRequests.map((ride) => (
                  <div className="request-card" key={ride.id || ride.booking_id}>
                    <div className="request-top">
                      <h3>{ride.riderName}</h3>
                      <span>Nu. {ride.fare}</span>
                    </div>
                    <p><FaMapMarkerAlt /> <strong>Pickup:</strong> {ride.pickup}</p>
                    <p><FaMapMarkerAlt /> <strong>Destination:</strong> {ride.destination}</p>
                    <button onClick={() => handleAcceptRide(ride)}>Accept Ride</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PAYMENT */}
          <div className="driver-card">
            <h2>Payment Verification</h2>
            {driverRides.length === 0 ? (
              <div className="offline-box"><p>No rides accepted yet.</p></div>
            ) : (
              <div className="requests-list">
                {driverRides.map((ride) => (
                  <div className="request-card" key={ride.id || ride.booking_id}>
                    <h3>{ride.riderName}</h3>
                    <p><strong>Payment:</strong> {ride.paymentStatus}</p>
                    {ride.paymentReference && (
                      <p><strong>Reference:</strong> {ride.paymentReference}</p>
                    )}
                    {ride.paymentScreenshot && (
                      <img src={ride.paymentScreenshot} alt="Payment proof" className="payment-proof-image" />
                    )}
                    {ride.paymentStatus === 'Pending Verification' && (
                      <div className="payment-actions">
                        <button onClick={() => handleVerifyPayment(ride.id)}>Verify</button>
                        <button className="reject-btn" onClick={() => handleRejectPayment(ride.id)}>Reject</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* CHAT */}
      {chatOpen && currentRide && (
        <RideChat
          rideId={String(currentRide.id)}
          userName={driverName}
          role="driver"
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}

export default DriverDashboardPage;