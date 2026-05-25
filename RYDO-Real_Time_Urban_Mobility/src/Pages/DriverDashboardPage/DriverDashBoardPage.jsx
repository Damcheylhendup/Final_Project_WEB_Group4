import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaMoneyBillWave, FaUser, FaUserCog, FaToggleOn, FaToggleOff, FaMapMarkerAlt } from 'react-icons/fa';
import { getPendingRides, acceptRide, getMyRides, verifyPayment, rejectPayment } from '../../api/rideApi';
import './DriverDashboardPage.css';

function DriverDashboardPage() {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false);
  const [currentRide, setCurrentRide] = useState(null);
  const [rideRequests, setRideRequests] = useState([]);
  const [driverRides, setDriverRides] = useState([]);

  const driver = JSON.parse(localStorage.getItem('currentUser')) || {
    fullName: 'Driver', vehicleType: 'Taxi', vehicleNumber: 'Not set',
  };

  const loadRideRequests = async () => {
    try {
      const response = await getPendingRides();
      setRideRequests(response.data);
    } catch (error) { console.log(error); }
  };

  const loadDriverRides = async () => {
    try {
      const response = await getMyRides();
      const acceptedRides = response.data.filter((ride) => ride.driver_id);
      setDriverRides(acceptedRides);
      const activeRide = acceptedRides.find(
        (ride) => ride.booking_status === 'confirmed' || ride.booking_status === 'in_progress'
      );
      if (activeRide) setCurrentRide(activeRide);
    } catch (error) { console.log(error); }
  };

  useEffect(() => {
    loadRideRequests();
    loadDriverRides();
  }, []);

  const handleAcceptRide = async (ride) => {
    try {
      const response = await acceptRide(ride.booking_id);
      alert(response.data.message);
      setCurrentRide(response.data.ride);
      loadRideRequests();
      loadDriverRides();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to accept ride');
    }
  };

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

  const updateRideStatus = (status) => {
    if (!currentRide) return;
    setCurrentRide({ ...currentRide, booking_status: status });
  };

  const completeRide = () => {
    updateRideStatus('completed');
    alert('Ride completed successfully');
    setCurrentRide(null);
  };

  const cancelRide = () => {
    updateRideStatus('cancelled');
    alert('Ride cancelled');
    setCurrentRide(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    navigate('/login');
  };

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
              <p>{driver.vehicleType || 'Taxi'} - {driver.vehicleNumber || 'Not set'}</p>
            </div>
          </div>
          <div className="stat-card">
            <FaMoneyBillWave />
            <div>
              <h3>Today's Earnings</h3>
              <p>Nu. 550</p>
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
                <p>{currentRide.driver_name}</p>
              </div>
              <span className="ride-status-badge">{currentRide.booking_status}</span>
            </div>
            <div className="active-details">
              <p><strong>Pickup:</strong> {currentRide.pickup_address}</p>
              <p><strong>Destination:</strong> {currentRide.drop_address}</p>
              <p><strong>Fare:</strong> Nu. {currentRide.fare}</p>
            </div>
            <div className="ride-progress-buttons">
              <button onClick={() => updateRideStatus('in_progress')}>Driver Arriving</button>
              <button onClick={() => updateRideStatus('in_progress')}>Start Trip</button>
              <button onClick={() => navigate('/map')}>Track Ride</button>
              <button className="complete-btn" onClick={completeRide}>Complete</button>
              <button className="cancel-btn" onClick={cancelRide}>Cancel</button>
            </div>
          </div>
        )}

        {/* GRID */}
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
                  <div className="request-card" key={ride.booking_id}>
                    <div className="request-top">
                      <h3>{ride.vehicle_type_requested}</h3>
                      <span>Nu. {ride.fare}</span>
                    </div>
                    <p><FaMapMarkerAlt /> <strong>Pickup:</strong> {ride.pickup_address}</p>
                    <p><FaMapMarkerAlt /> <strong>Destination:</strong> {ride.drop_address}</p>
                    <button onClick={() => handleAcceptRide(ride)}>Accept Ride</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PAYMENT VERIFICATION */}
          <div className="driver-card">
            <h2>Payment Verification</h2>
            {driverRides.length === 0 ? (
              <div className="offline-box"><p>No rides accepted yet.</p></div>
            ) : (
              <div className="requests-list">
                {driverRides.map((ride) => (
                  <div className="request-card" key={ride.booking_id}>
                    <h3>{ride.pickup_address}</h3>
                    <p><strong>Payment:</strong> {ride.payment_status}</p>
                    {ride.payment_reference && (
                      <p><strong>Reference:</strong> {ride.payment_reference}</p>
                    )}
                    {ride.payment_screenshot && (
                      <img src={ride.payment_screenshot} alt="Payment proof" className="payment-proof-image" />
                    )}
                    {ride.payment_status === 'pending_verification' && (
                      <div className="payment-actions">
                        <button onClick={() => handleVerifyPayment(ride.booking_id)}>Verify</button>
                        <button className="reject-btn" onClick={() => handleRejectPayment(ride.booking_id)}>Reject</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DriverDashboardPage;