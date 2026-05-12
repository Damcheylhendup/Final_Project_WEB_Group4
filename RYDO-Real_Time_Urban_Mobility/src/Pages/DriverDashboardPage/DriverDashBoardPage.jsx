import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

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
  const navigate =
    useNavigate();

  const [isOnline, setIsOnline] =
    useState(false);

  const [currentRide, setCurrentRide] =
    useState(null);

  const [rideRequests, setRideRequests] =
    useState([]);

  const [driverRides, setDriverRides] =
    useState([]);

  const driver =
    JSON.parse(
      localStorage.getItem(
        'currentUser'
      )
    ) || {
      fullName: 'Driver',

      vehicleType: 'Taxi',

      vehicleNumber:
        'Not set',
    };

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

  const loadDriverRides =
    async () => {
      try {
        const response =
          await getMyRides();

        const acceptedRides =
          response.data.filter(
            (ride) =>
              ride.driverId
          );

        setDriverRides(
          acceptedRides
        );

        const activeRide =
          acceptedRides.find(
            (ride) =>
              ride.status ===
                'Accepted' ||
              ride.status ===
                'Ongoing'
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

  useEffect(() => {
    loadRideRequests();

    loadDriverRides();
  }, []);

  const handleAcceptRide =
    async (ride) => {
      try {
        const response =
          await acceptRide(
            ride.id
          );

        alert(
          response.data
            .message
        );

        setCurrentRide(
          response.data
            .ride
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

  const handleVerifyPayment =
    async (rideId) => {
      try {
        const response =
          await verifyPayment(
            rideId
          );

        alert(
          response.data
            .message
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

  const handleRejectPayment =
    async (rideId) => {
      try {
        const response =
          await rejectPayment(
            rideId
          );

        alert(
          response.data
            .message
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

        <section className="stats-grid">
          <div className="stat-card">
            <FaCar />

            <div>
              <h3>Vehicle</h3>

              <p>
                {driver.vehicleType ||
                  'Taxi'}{' '}
                -{' '}
                {driver.vehicleNumber ||
                  'Not set'}
              </p>
            </div>
          </div>

          <div className="stat-card">
            <FaMoneyBillWave />

            <div>
              <h3>
                Today’s Earnings
              </h3>

              <p>Nu. 550</p>
            </div>
          </div>

          <div className="stat-card">
            <FaUser />

            <div>
              <h3>Total Trips</h3>

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
                Manage profile
              </p>
            </div>
          </div>
        </section>

        <section className="driver-grid">
          <div className="driver-card">
            <h2>
              Available Ride
              Requests
            </h2>

            {!isOnline ? (
              <div className="offline-box">
                <p>
                  You are
                  offline.
                </p>
              </div>
            ) : currentRide ? (
              <div className="offline-box">
                <p>
                  Active ride
                  in progress.
                </p>
              </div>
            ) : rideRequests.length ===
              0 ? (
              <div className="offline-box">
                <p>
                  No pending
                  rides.
                </p>
              </div>
            ) : (
              <div className="requests-list">
                {rideRequests.map(
                  (ride) => (
                    <div
                      className="request-card"
                      key={
                        ride.id
                      }
                    >
                      <div className="request-top">
                        <h3>
                          {
                            ride.riderName
                          }
                        </h3>

                        <span>
                          Nu.{' '}
                          {
                            ride.fare
                          }
                        </span>
                      </div>

                      <p>
                        <FaMapMarkerAlt />{' '}
                        <strong>
                          Pickup:
                        </strong>{' '}
                        {
                          ride.pickup
                        }
                      </p>

                      <p>
                        <FaMapMarkerAlt />{' '}
                        <strong>
                          Destination:
                        </strong>{' '}
                        {
                          ride.destination
                        }
                      </p>

                      <button
                        onClick={() =>
                          handleAcceptRide(
                            ride
                          )
                        }
                      >
                        Accept
                        Ride
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="driver-card">
            <h2>
              Payment
              Verification
            </h2>

            {driverRides.length ===
            0 ? (
              <div className="offline-box">
                <p>
                  No rides
                  accepted yet.
                </p>
              </div>
            ) : (
              <div className="requests-list">
                {driverRides.map(
                  (ride) => (
                    <div
                      className="request-card"
                      key={
                        ride.id
                      }
                    >
                      <h3>
                        {
                          ride.riderName
                        }
                      </h3>

                      <p>
                        <strong>
                          Payment:
                        </strong>{' '}
                        {
                          ride.paymentStatus
                        }
                      </p>

                      {ride.paymentReference && (
                        <p>
                          <strong>
                            Reference:
                          </strong>{' '}
                          {
                            ride.paymentReference
                          }
                        </p>
                      )}

                      {ride.paymentScreenshot && (
                        <img
                          src={
                            ride.paymentScreenshot
                          }
                          alt="Payment proof"
                          className="payment-proof-image"
                        />
                      )}

                      {ride.paymentStatus ===
                        'Pending Verification' && (
                        <div className="payment-actions">
                          <button
                            onClick={() =>
                              handleVerifyPayment(
                                ride.id
                              )
                            }
                          >
                            Verify
                          </button>

                          <button
                            className="reject-btn"
                            onClick={() =>
                              handleRejectPayment(
                                ride.id
                              )
                            }
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DriverDashboardPage;