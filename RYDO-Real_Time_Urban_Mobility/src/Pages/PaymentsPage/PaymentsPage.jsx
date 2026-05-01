import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentsPage.css';

function PaymentsPage() {
  const navigate = useNavigate();
  const [latestRide, setLatestRide] = useState(null);
  const [reference, setReference] = useState('');

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const rides = JSON.parse(localStorage.getItem('rides')) || [];

    const userRides = rides.filter(
      (ride) =>
        ride.riderId === currentUser?.id ||
        ride.riderName === currentUser?.fullName
    );

    if (userRides.length > 0) {
      setLatestRide(userRides[userRides.length - 1]);
    }
  }, []);

  const handlePayment = () => {
    if (!latestRide) {
      alert('No ride found');
      return;
    }

    if (!reference.trim()) {
      alert('Please enter payment reference number');
      return;
    }

    const rides = JSON.parse(localStorage.getItem('rides')) || [];

    const updatedRides = rides.map((ride) =>
      ride.id === latestRide.id
        ? {
            ...ride,
            paymentStatus: 'Paid',
            paymentReference: reference,
          }
        : ride
    );

    localStorage.setItem('rides', JSON.stringify(updatedRides));

    alert('Payment submitted successfully');
    navigate('/trips');
  };

  return (
    <div className="payments-page">
      <div className="payments-card">
        <button className="back-btn" onClick={() => navigate('/trips')}>
          ← Back
        </button>

        <h1>Payment</h1>
        <p className="subtitle">
          Complete your payment using bank QR/reference.
        </p>

        {!latestRide ? (
          <div className="empty-payment">
            <h2>No ride found</h2>
            <p>Please book a ride before making payment.</p>
            <button onClick={() => navigate('/booking')}>Book Ride</button>
          </div>
        ) : (
          <>
            <div className="payment-summary">
              <h2>Ride Summary</h2>
              <p>
                <strong>Pickup:</strong> {latestRide.pickup}
              </p>
              <p>
                <strong>Destination:</strong> {latestRide.destination}
              </p>
              <p>
                <strong>Ride Type:</strong> {latestRide.rideType}
              </p>
              <p>
                <strong>Distance:</strong> {latestRide.distance} km
              </p>
              <p>
                <strong>Status:</strong> {latestRide.status}
              </p>
              <p>
                <strong>Payment:</strong> {latestRide.paymentStatus || 'Unpaid'}
              </p>
              <h3>Total: Nu. {latestRide.fare}</h3>
            </div>

            <div className="qr-box">
              <div className="fake-qr">QR</div>
              <p>Scan using mBoB / Mpay / Bank app</p>
            </div>

            <input
              type="text"
              placeholder="Enter payment reference number"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="payment-input"
            />

            <button className="pay-btn" onClick={handlePayment}>
              Submit Payment
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentsPage;