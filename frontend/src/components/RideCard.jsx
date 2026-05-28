import './RideCard.css';

function RideCard({ ride, onTrack, onPay }) {
  const getStatusClass = (status) => {
    if (status === 'Accepted') return 'ride-status accepted';
    if (status === 'Completed') return 'ride-status completed';
    if (status === 'Arrived') return 'ride-status arrived';
    return 'ride-status pending';
  };

  return (
    <div className="ride-card">
      <div className="ride-card-top">
        <h2>{ride.rideType} Ride</h2>
        <span className={getStatusClass(ride.status)}>{ride.status}</span>
      </div>

      <div className="ride-info">
        <p><strong>Pickup:</strong> {ride.pickup}</p>
        <p><strong>Destination:</strong> {ride.destination}</p>
        <p><strong>Distance:</strong> {ride.distance} km</p>
        <p><strong>Fare:</strong> Nu. {ride.fare}</p>
        <p><strong>Payment:</strong> {ride.paymentStatus || 'Unpaid'}</p>

        {ride.driverName && (
          <p><strong>Driver:</strong> {ride.driverName}</p>
        )}

        <p><strong>Date:</strong> {ride.date}</p>
      </div>

      <div className="ride-actions">
        <button onClick={onTrack}>Track Ride</button>
        <button onClick={onPay}>Pay Now</button>
      </div>
    </div>
  );
}

export default RideCard;