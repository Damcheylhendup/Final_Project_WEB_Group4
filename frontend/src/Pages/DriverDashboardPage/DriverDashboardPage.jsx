import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
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
} from '../../api/rideApi';

import RideChat from '../TripsPage/RideChat';
import socket from '../../websocket/userRideSocket';
import './DriverDashboardPage.css';

function DriverDashboardPage() {
  const navigate = useNavigate();

  const [isOnline, setIsOnline] = useState(false);
  const [currentRide, setCurrentRide] = useState(null);
  const [rideRequests, setRideRequests] = useState([]);
  const [driverRides, setDriverRides] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const driver =
    JSON.parse(localStorage.getItem('currentUser')) || {
      fullName: 'Driver',
      vehicleType: 'Taxi',
      vehicleNumber: 'Not set',
    };

  /* =========================
     SOCKET SETUP
  ========================= */
  useEffect(() => {
    if (!socket.connected) socket.connect();
  }, []);

  /* =========================
     JOIN RIDE ROOM when currentRide changes
  ========================= */
  useEffect(() => {
    if (!currentRide) return;
    // Additional logic for joining ride room can go here
  }, [currentRide]);

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
  useEffect(() => {
    loadRideRequests();
    loadDriverRides();

    const interval = setInterval(() => {
      loadRideRequests();
      loadDriverRides();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /* =========================
     ACCEPT RIDE
  ========================= */
  const handleAcceptRide = async (ride) => {
    setLoading(true);
    try {
      const response = await acceptRide(ride.booking_id);
      alert(response.data.message);
      setCurrentRide(response.data.ride);
      loadRideRequests();
      loadDriverRides();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to accept ride');
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     VERIFY PAYMENT
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

  /* =========================
     REJECT PAYMENT
  ========================= */
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
     UPDATE RIDE STATUS
  ========================= */
  const updateRideStatus = (status) => {
    if (!currentRide) return;
    setCurrentRide({ ...currentRide, booking_status: status });
  };

  /* =========================
     COMPLETE RIDE
  ========================= */
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
     CANCEL RIDE
  ========================= */
  const cancelRide = () => {
    updateRideStatus('cancelled');
    alert('Ride cancelled');
    setCurrentRide(null);
    setChatOpen(false);
  };

  /* =========================
     LOGOUT
  ========================= */
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    navigate('/login');
  };

  /* =========================
     CALCULATE TOTAL EARNINGS
  ========================= */
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

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {/* WELCOME */}
        <section className="driver-welcome">
          <div>
            <h1>Driver Dashboard</h1>
            <p>Welcome, {driver.fullName}.</p>
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
              <p>{driver.vehicleType} - {driver.vehicleNumber}</p>
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
            <FaUserCog />
            <div>
              <h3>Account & Settings</h3>
              <p>Manage profile</p>
            </div>
          </div>
        </section>

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

      </div>

      {/* CHAT */}
      {chatOpen && currentRide && (
        <RideChat
          rideId={String(currentRide.id)}
          userName={driver.fullName}
          role="driver"
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}

export default DriverDashboardPage;