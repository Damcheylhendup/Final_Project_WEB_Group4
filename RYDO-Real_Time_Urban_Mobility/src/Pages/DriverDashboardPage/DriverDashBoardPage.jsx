import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
<<<<<<< HEAD
  FaCar,
  FaMoneyBillWave,
  FaUser,
  FaUserCog,
  FaToggleOn,
  FaToggleOff,
  FaMapMarkerAlt,
  FaClock,
  FaRoad,
} from 'react-icons/fa';

import {
  getPendingRides,
  acceptRide,
  getMyRides,
  verifyPayment,
  rejectPayment,
  completeRide as completeRideApi
=======
  FaCar, FaMoneyBillWave, FaUser,
  FaUserCog, FaToggleOn, FaToggleOff, FaMapMarkerAlt,
} from 'react-icons/fa';

import {
  getPendingRides, acceptRide, getMyRides,
  verifyPayment, rejectPayment,
>>>>>>> e02678e62532c557f4b1b3eb7bbe0d036a1490f4
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

<<<<<<< HEAD
  const [isOnline, setIsOnline] = useState(false);
  const [currentRide, setCurrentRide] = useState(null);
  const [rideRequests, setRideRequests] = useState([]);
  const [driverRides, setDriverRides] = useState([]);
  const [loading, setLoading] = useState(false);
=======
  const driver     = JSON.parse(localStorage.getItem('currentUser')) || {};
  const driverName = driver.fullName || driver.email || 'Driver';
>>>>>>> e02678e62532c557f4b1b3eb7bbe0d036a1490f4

  /* =========================
     SOCKET SETUP
  ========================= */
  useEffect(() => {
    // Confirm socket is alive
    if (!socket.connected) socket.connect();

<<<<<<< HEAD
  const driver =
    JSON.parse(localStorage.getItem('currentUser')) || {
      fullName: 'Driver',
      vehicleType: 'Taxi',
      vehicleNumber: 'Not set',
=======
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
>>>>>>> e02678e62532c557f4b1b3eb7bbe0d036a1490f4
    };
  }, []);

  /* =========================
     JOIN RIDE ROOM when currentRide changes
  ========================= */
  useEffect(() => {
    if (!currentRide) return;

<<<<<<< HEAD
const totalEarnings = driverRides
  .filter(
    (ride) =>
      ride.booking_status === 'completed' &&
      ride.payment_status === 'verified'
  )
  .reduce(
    (total, ride) => total + Number(ride.fare || 0),
    0
  );
=======
    socket.emit('join-ride', {
      rideId: String(currentRide.id),
      role: 'driver',
      userName: driverName,
    });

    console.log('🚗 Driver joined ride room:', currentRide.id);
  }, [currentRide?.id]);
>>>>>>> e02678e62532c557f4b1b3eb7bbe0d036a1490f4

  /* =========================
     LOAD PENDING RIDES
  ========================= */
<<<<<<< HEAD

=======
>>>>>>> e02678e62532c557f4b1b3eb7bbe0d036a1490f4
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

<<<<<<< HEAD
const loadDriverRides = async () => {
  try {
    const response = await getMyRides();

    const acceptedRides = response.data.filter(
      (ride) => Number(ride.driver_id) > 0
    );

    setDriverRides(acceptedRides);

    const activeRide = acceptedRides.find(
      (ride) =>
        (ride.booking_status === 'confirmed' ||
          ride.booking_status === 'in_progress') &&
        ride.payment_status !== 'verified'
    );

    setCurrentRide(activeRide || null);

  } catch (error) {
    console.log(error);
  }
};
  /* =========================
     INITIAL LOAD + POLLING
  ========================= */
=======
      setDriverRides(rides);

      const activeRide = rides.find((ride) =>
        ['Accepted', 'Driver Arriving', 'Ongoing'].includes(ride.status)
      );

      if (activeRide) setCurrentRide(activeRide);
    } catch (error) {
      console.log(error);
    }
  };
>>>>>>> e02678e62532c557f4b1b3eb7bbe0d036a1490f4

  useEffect(() => {
    loadRideRequests();
    loadDriverRides();

    // Poll for new ride requests every 10 seconds
const interval = setInterval(() => {
  loadRideRequests();
  loadDriverRides();
}, 5000);

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  /* =========================
     ACCEPT RIDE
  ========================= */
<<<<<<< HEAD

  const handleAcceptRide = async (ride) => {
    setLoading(true);
    try {
      const response = await acceptRide(ride.booking_id);
=======
  const handleAcceptRide = async (ride) => {
    try {
      const response = await acceptRide(ride.id || ride.booking_id);
>>>>>>> e02678e62532c557f4b1b3eb7bbe0d036a1490f4
      alert(response.data.message);
      setCurrentRide(response.data.ride);
      loadRideRequests();
      loadDriverRides();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to accept ride');
<<<<<<< HEAD
    } finally {
      setLoading(false);
=======
>>>>>>> e02678e62532c557f4b1b3eb7bbe0d036a1490f4
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

<<<<<<< HEAD
  const handleVerifyPayment = async (rideId) => {
    try {
      const response = await verifyPayment(rideId);
      alert(response.data.message);
      loadDriverRides();
    } catch (error) {
      alert(error.response?.data?.message || 'Verification failed');
=======
  const handleRejectPayment = async (rideId) => {
    try {
      const response = await rejectPayment(rideId);
      alert(response.data.message);
      loadDriverRides();
    } catch (error) {
      alert(error.response?.data?.message || 'Rejection failed');
>>>>>>> e02678e62532c557f4b1b3eb7bbe0d036a1490f4
    }
  };

  /* =========================
     UPDATE STATUS — now emits to socket
  ========================= */
<<<<<<< HEAD

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
     UPDATE STATUS
  ========================= */

  const updateRideStatus = (status) => {
    if (!currentRide) return;
    setCurrentRide({ ...currentRide, booking_status: status });
=======
  const updateRideStatus = (status) => {
    if (!currentRide) return;

    // ← Tell all clients in this ride room
    socket.emit('ride-status-update', {
      rideId: String(currentRide.id),
      status,
    });

    setCurrentRide((prev) => ({ ...prev, status }));
>>>>>>> e02678e62532c557f4b1b3eb7bbe0d036a1490f4
  };

  /* =========================
     COMPLETE RIDE
  ========================= */
<<<<<<< HEAD

const completeRide = async () => {
  try {

    console.log("Current Ride:", currentRide);

    const response = await completeRideApi(
      currentRide.booking_id
    );

    console.log("Complete Response:", response.data);

    alert(response.data.message);

    loadDriverRides();

  } catch (error) {

    console.error(error);

    alert(
      JSON.stringify(error.response?.data) ||
      error.message
    );
  }
};

/* =========================
=======
  const completeRide = () => {
    updateRideStatus('Completed');
    alert('Ride completed successfully');
    setCurrentRide(null);
    setChatOpen(false);
  };

  /* =========================
>>>>>>> e02678e62532c557f4b1b3eb7bbe0d036a1490f4
     CANCEL RIDE
  ========================= */
  const cancelRide = () => {
<<<<<<< HEAD
    updateRideStatus('cancelled');
=======
    updateRideStatus('Cancelled');
>>>>>>> e02678e62532c557f4b1b3eb7bbe0d036a1490f4
    alert('Ride cancelled');
    setCurrentRide(null);
    setChatOpen(false);
  };

  /* =========================
     LOGOUT
  ========================= */
  const handleLogout = () => {
<<<<<<< HEAD
=======
    socket.disconnect(); // ← clean disconnect
>>>>>>> e02678e62532c557f4b1b3eb7bbe0d036a1490f4
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
<<<<<<< HEAD
            </button>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
=======
>>>>>>> e02678e62532c557f4b1b3eb7bbe0d036a1490f4
            </button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        {/* WELCOME */}
        <section className="driver-welcome">
          <div>
            <h1>Driver Dashboard</h1>
<<<<<<< HEAD
            <p>Welcome, {driver.fullName}.</p>
=======
            <p>Welcome, {driverName}</p>
>>>>>>> e02678e62532c557f4b1b3eb7bbe0d036a1490f4
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
<<<<<<< HEAD
              <p>{driver.vehicleType} - {driver.vehicleNumber}</p>
=======
              <p>{driver.vehicleType || 'Taxi'} - {driver.vehicleNumber || 'Not set'}</p>
>>>>>>> e02678e62532c557f4b1b3eb7bbe0d036a1490f4
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
<<<<<<< HEAD
              <p>
  {
    driverRides.filter(
      (ride) =>
        ride.booking_status === 'completed' &&
        ride.payment_status === 'verified'
    ).length
  } rides
</p>
            </div>
          </div>

          <div
            className="stat-card clickable-card"
            onClick={() => navigate('/account')}
          >
=======
              <p>{driverRides.length} rides</p>
            </div>
          </div>
          <div className="stat-card clickable-card" onClick={() => navigate('/account')}>
>>>>>>> e02678e62532c557f4b1b3eb7bbe0d036a1490f4
            <FaUserCog />
            <div>
              <h3>Account & Settings</h3>
              <p>Manage profile</p>
            </div>
          </div>
        </section>

<<<<<<< HEAD
        {/* ========================= */}
        {/* INCOMING RIDE REQUESTS    */}
        {/* ========================= */}
        <section className="ride-requests-section">
          <div className="section-header">
            <h2>Incoming Ride Requests</h2>
            {isOnline && (
              <span className="polling-badge">
                <FaClock /> Auto-refreshing
              </span>
            )}
          </div>

          {/* Offline warning */}
          {!isOnline && (
            <div className="offline-banner">
              <FaToggleOff />
              <p>You are <strong>offline</strong>. Go online to receive ride requests.</p>
            </div>
          )}

          {/* No rides */}
          {isOnline && rideRequests.length === 0 && (
            <div className="empty-state">
              <FaCar />
              <p>No pending ride requests right now.</p>
              <small>New requests will appear automatically.</small>
            </div>
          )}

          {/* Ride cards */}
          {isOnline && rideRequests.length > 0 && (
            <div className="ride-cards-grid">
              {rideRequests.map((ride) => (
                <div key={ride.booking_id} className="ride-request-card">
                  <div className="ride-request-header">
                    <span className="ride-type-badge">{ride.vehicle_type_requested}</span>
                    <span className="ride-fare">Nu. {ride.fare}</span>
                  </div>

                  <div className="ride-request-body">
                    <div className="ride-location">
                      <div className="location-row">
                        <FaMapMarkerAlt className="icon-green" />
                        <div>
                          <small>Pickup</small>
                          <p>{ride.pickup_address}</p>
                        </div>
                      </div>

                      <div className="location-divider" />

                      <div className="location-row">
                        <FaMapMarkerAlt className="icon-red" />
                        <div>
                          <small>Drop-off</small>
                          <p>{ride.drop_address}</p>
                        </div>
                      </div>
                    </div>

                    <div className="ride-meta">
                      <span>
                        <FaRoad /> {ride.distance_km} km
                      </span>
                    </div>
                  </div>

                  <button
                    className="accept-btn"
                    onClick={() => handleAcceptRide(ride)}
                    disabled={loading}
                  >
                    {loading ? 'Accepting...' : 'Accept Ride'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ========================= */}
        {/* CURRENT ACTIVE RIDE       */}
        {/* ========================= */}
        {currentRide && (
          <section className="current-ride-section">
            <h2>Current Ride</h2>

            <div className="current-ride-card">
              <div className="current-ride-status">
                <span className={`status-badge status-${currentRide.booking_status}`}>
                  {currentRide.booking_status}
                </span>
              </div>

              <div className="location-row">
                <FaMapMarkerAlt className="icon-green" />
                <div>
                  <small>Pickup</small>
                  <p>{currentRide.pickup_address}</p>
                </div>
              </div>

              <div className="location-divider" />

              <div className="location-row">
                <FaMapMarkerAlt className="icon-red" />
                <div>
                  <small>Drop-off</small>
                  <p>{currentRide.drop_address}</p>
                </div>
              </div>

              <div className="current-ride-fare">
                <FaMoneyBillWave />
                <strong>Fare: Nu. {currentRide.fare}</strong>
              </div>

              <div className="current-ride-actions">
                <button className="complete-btn" onClick={completeRide}>
                  Complete Ride
                </button>
                <button className="cancel-ride-btn" onClick={cancelRide}>
                  Cancel Ride
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ========================= */}
        {/* RIDE HISTORY + PAYMENTS   */}
        {/* ========================= */}
        {driverRides.length > 0 && (
          <section className="ride-history-section">
            <h2>My Rides</h2>

            <div className="ride-history-list">
              {driverRides.map((ride) => (
                <div key={ride.booking_id} className="history-card">
                  <div className="history-card-header">
                    <span>{ride.pickup_address} → {ride.drop_address}</span>
                    <span className="ride-fare">Nu. {ride.fare}</span>
                  </div>

                  <div className="history-card-meta">
                    <span className={`status-badge status-${ride.booking_status}`}>
                      {ride.booking_status}
                    </span>
                    <span className={`payment-badge payment-${ride.payment_status}`}>
                      {ride.payment_status}
                    </span>
                  </div>

                  {/* Payment screenshot preview */}
                  {ride.payment_screenshot && (
                    <div className="payment-screenshot">
                      <img
                        src={ride.payment_screenshot}
                        alt="Payment proof"
                      />
                    </div>
                  )}

                  {/* Verify / Reject buttons */}
                  {ride.payment_status === 'pending_verification' && (
                    <div className="payment-actions">
                      <button
                        className="verify-btn"
                        onClick={() => handleVerifyPayment(ride.booking_id)}
                      >
                        Verify Payment
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleRejectPayment(ride.booking_id)}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

=======
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
>>>>>>> e02678e62532c557f4b1b3eb7bbe0d036a1490f4
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