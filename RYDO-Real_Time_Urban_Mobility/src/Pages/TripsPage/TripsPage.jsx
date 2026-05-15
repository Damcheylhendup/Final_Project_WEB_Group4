import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyRides } from '../../api/rideApi';
import './TripsPage.css';

function TripsPage() {
  const navigate = useNavigate();
  const [rides,   setRides]   = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRides = async () => {
    try {
      const response = await getMyRides();
      setRides(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRides(); }, []);

  const getStatusClass = (status) => {
    if (status === 'confirmed')   return 'status accepted';
    if (status === 'completed')   return 'status completed';
    if (status === 'cancelled')   return 'status cancelled';
    if (status === 'in_progress') return 'status accepted';
    return 'status pending';
  };

  return (
    <div className="trips-page">
      <div className="trips-container">
        <div className="trips-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
          <h1>My Trips</h1>
          <p>View your current and past Rydo bookings.</p>
        </div>

        {loading ? (
          <div className="empty-box"><h2>Loading trips...</h2></div>
        ) : rides.length === 0 ? (
          <div className="empty-box">
            <h2>No trips yet</h2>
            <p>Your booked rides will appear here.</p>
            <button onClick={() => navigate('/booking')}>Book a Ride</button>
          </div>
        ) : (
          <div className="trips-list">
            {rides.map((ride) => (
              <div className="trip-card" key={ride.booking_id}>
                <div className="trip-top">
                  <h2>{ride.vehicle_type_requested} Ride</h2>
                  <span className={getStatusClass(ride.booking_status)}>
                    {ride.booking_status}
                  </span>
                </div>

                <div className="trip-info">
                  <p><strong>Pickup:</strong> {ride.pickup_address}</p>
                  <p><strong>Destination:</strong> {ride.drop_address}</p>
                  <p><strong>Distance:</strong> {ride.distance_km} km</p>
                  <p><strong>Fare:</strong> Nu. {ride.fare}</p>
                  <p><strong>Payment:</strong> {ride.payment_status || 'unpaid'}</p>
                  {ride.driver_name && <p><strong>Driver:</strong> {ride.driver_name}</p>}
                  <p><strong>Date:</strong> {ride.booking_date} {ride.booking_time}</p>
                </div>

                <div className="trip-actions">
                  <button onClick={() => navigate('/map')}>Track Ride</button>
                  <button onClick={() => navigate('/payments')}>Pay Now</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TripsPage;