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
} from 'react-icons/fa';

import {
  getPendingRides,
  acceptRide,
  getMyRides,
  verifyPayment,
  rejectPayment,
} from '../../api/rideApi';

import './DriverDashboardPage.css';

function DriverDashboardPage() {
  const navigate = useNavigate();

  /* =========================
     STATES
  ========================= */

  const [isOnline, setIsOnline] =
    useState(false);

  const [currentRide, setCurrentRide] =
    useState(null);

  const [rideRequests, setRideRequests] =
    useState([]);

  const [driverRides, setDriverRides] =
    useState([]);

  /* =========================
     DRIVER INFO
  ========================= */

  const driver =
    JSON.parse(
      localStorage.getItem(
        'currentUser'
      )
    ) || {
      fullName: 'Driver',
      vehicleType: 'Taxi',
      vehicleNumber: 'Not set',
    };

  /* =========================
     TOTAL EARNINGS
     Counts only verified rides
  ========================= */

  const totalEarnings =
    driverRides.reduce(
      (total, ride) => {
        const verified =
          ride.payment_status ===
            'verified' ||
          ride.payment_status ===
            'Verified';

        return verified
          ? total +
              Number(
                ride.fare || 0
              )
          : total;
      },
      0
    );

  /* =========================
     LOAD PENDING RIDES
  ========================= */

  const loadRideRequests =
    async () => {
      try {
        const response =
          await getPendingRides();

        setRideRequests(
          response.data
        );
      } catch (error) {
        console.log(error);
      }
    };

  /* =========================
     LOAD DRIVER RIDES
  ========================= */

  const loadDriverRides =
    async () => {
      try {
        const response =
          await getMyRides();

        const acceptedRides =
          response.data.filter(
            (ride) =>
              ride.driver_id
          );

        setDriverRides(
          acceptedRides
        );

        const activeRide =
          acceptedRides.find(
            (ride) =>
              ride.booking_status ===
                'confirmed' ||
              ride.booking_status ===
                'in_progress'
          );

        if (activeRide) {
          setCurrentRide(
            activeRide
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    loadRideRequests();
    loadDriverRides();
  }, []);

  /* =========================
     ACCEPT RIDE
  ========================= */

  const handleAcceptRide =
    async (ride) => {
      try {
        const response =
          await acceptRide(
            ride.booking_id
          );

        alert(
          response.data.message
        );

        setCurrentRide(
          response.data.ride
        );

        loadRideRequests();
        loadDriverRides();
      } catch (error) {
        alert(
          error.response?.data
            ?.message ||
            'Failed to accept ride'
        );
      }
    };

  /* =========================
     VERIFY PAYMENT
  ========================= */

  const handleVerifyPayment =
    async (rideId) => {
      try {
        const response =
          await verifyPayment(
            rideId
          );

        alert(
          response.data.message
        );

        loadDriverRides();
      } catch (error) {
        alert(
          error.response?.data
            ?.message ||
            'Verification failed'
        );
      }
    };

  /* =========================
     REJECT PAYMENT
  ========================= */

  const handleRejectPayment =
    async (rideId) => {
      try {
        const response =
          await rejectPayment(
            rideId
          );

        alert(
          response.data.message
        );

        loadDriverRides();
      } catch (error) {
        alert(
          error.response?.data
            ?.message ||
            'Rejection failed'
        );
      }
    };

  /* =========================
     UPDATE STATUS
  ========================= */

  const updateRideStatus = (
    status
  ) => {
    if (!currentRide) return;

    setCurrentRide({
      ...currentRide,
      booking_status: status,
    });
  };

  /* =========================
     COMPLETE RIDE
  ========================= */

  const completeRide = () => {
    updateRideStatus(
      'completed'
    );

    alert(
      'Ride completed successfully'
    );

    setCurrentRide(null);
  };

  /* =========================
     CANCEL RIDE
  ========================= */

  const cancelRide = () => {
    updateRideStatus(
      'cancelled'
    );

    alert('Ride cancelled');

    setCurrentRide(null);
  };

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    localStorage.removeItem(
      'currentUser'
    );

    localStorage.removeItem(
      'token'
    );

    navigate('/login');
  };

  return (
    <div className="driver-page">
      <div className="driver-container">

        {/* HEADER */}

        <header className="driver-header">
          <div className="driver-logo">
            <span className="yellow">
              RY
            </span>

            <span className="red">
              DO
            </span>
          </div>

          <div className="header-actions">
            <button
              className={
                isOnline
                  ? 'status-btn online'
                  : 'status-btn offline'
              }
              onClick={() =>
                setIsOnline(
                  !isOnline
                )
              }
            >
              {isOnline ? (
                <FaToggleOn />
              ) : (
                <FaToggleOff />
              )}

              {isOnline
                ? 'Online'
                : 'Offline'}
            </button>

            <button
              className="logout-btn"
              onClick={
                handleLogout
              }
            >
              Logout
            </button>
          </div>
        </header>

        {/* WELCOME */}

        <section className="driver-welcome">
          <div>
            <h1>
              Driver Dashboard
            </h1>

            <p>
              Welcome,{' '}
              {
                driver.fullName
              }
              .
            </p>
          </div>

          <div className="driver-status-box">
            <p>Status</p>

            <h2>
              {isOnline
                ? 'Available'
                : 'Unavailable'}
            </h2>
          </div>
        </section>

        {/* STATS */}

        <section className="stats-grid">

          <div className="stat-card">
            <FaCar />

            <div>
              <h3>Vehicle</h3>

              <p>
                {
                  driver.vehicleType
                }{' '}
                -{' '}
                {
                  driver.vehicleNumber
                }
              </p>
            </div>
          </div>

          <div className="stat-card earnings-card">
            <FaMoneyBillWave />

            <div>
              <h3>
                Total Earnings
              </h3>

              <p>
                Nu.{' '}
                {
                  totalEarnings
                }
              </p>
            </div>
          </div>

          <div className="stat-card">
            <FaUser />

            <div>
              <h3>
                Total Trips
              </h3>

              <p>
                {
                  driverRides.length
                }{' '}
                rides
              </p>
            </div>
          </div>

          <div
            className="stat-card clickable-card"
            onClick={() =>
              navigate(
                '/account'
              )
            }
          >
            <FaUserCog />

            <div>
              <h3>
                Account &
                Settings
              </h3>

              <p>
                Manage
                profile
              </p>
            </div>
          </div>
        </section>

        {/* KEEP THE REST OF YOUR EXISTING JSX BELOW UNCHANGED */}
      </div>
    </div>
  );
}

export default DriverDashboardPage;