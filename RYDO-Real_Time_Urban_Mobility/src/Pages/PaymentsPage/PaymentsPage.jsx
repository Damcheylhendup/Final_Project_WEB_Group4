import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentsPage.css';

function PaymentsPage() {
  const navigate = useNavigate();
  const [latestRide, setLatestRide] = useState(null);
  const [reference, setReference] = useState('');
  const [screenshot, setScreenshot] = useState(null); // { file, preview }
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setScreenshot({ file, preview: e.target.result });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePayment = () => {
    if (!latestRide) {
      alert('No ride found');
      return;
    }

    if (!reference.trim() && !screenshot) {
      alert('Please enter a payment reference number or upload a screenshot');
      return;
    }

    const rides = JSON.parse(localStorage.getItem('rides')) || [];

    const updatedRides = rides.map((ride) =>
      ride.id === latestRide.id
        ? {
            ...ride,
            paymentStatus: 'Paid',
            paymentReference: reference,
            paymentScreenshot: screenshot?.preview || null,
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
          Complete your payment using the accepted driver's bank details.
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
              <p><strong>Pickup:</strong> {latestRide.pickup}</p>
              <p><strong>Destination:</strong> {latestRide.destination}</p>
              <p><strong>Ride Type:</strong> {latestRide.rideType}</p>
              <p><strong>Distance:</strong> {latestRide.distance} km</p>
              <p><strong>Status:</strong> {latestRide.status}</p>
              <p><strong>Payment:</strong> {latestRide.paymentStatus || 'Unpaid'}</p>
              <h3>Total: Nu. {latestRide.fare}</h3>
            </div>

            <div className="driver-payment-details">
              <h2>Driver Payment Details</h2>
              <p><strong>Driver:</strong> {latestRide.driverName || 'Not assigned yet'}</p>
              <p><strong>Bank:</strong> {latestRide.driverBankName || 'Not provided'}</p>
              <p><strong>Account Holder:</strong> {latestRide.driverAccountHolder || 'Not provided'}</p>
              <p><strong>Account Number:</strong> {latestRide.driverAccountNumber || 'Not provided'}</p>
            </div>

            <div className="qr-box">
              {latestRide.driverQrImage ? (
                <img
                  src={latestRide.driverQrImage}
                  alt="Driver payment QR"
                  className="payment-qr-image"
                />
              ) : (
                <div className="fake-qr">QR</div>
              )}
              <p>Scan using mBoB / Mpay / Bank app</p>
            </div>

            {latestRide.status === 'Pending' && (
              <p className="payment-warning">
                A driver has not accepted this ride yet. Payment details may be incomplete.
              </p>
            )}

            {/* Reference number input */}
            <input
              type="text"
              placeholder="Enter payment reference number"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="payment-input"
            />

            {/* Divider */}
            <div className="payment-divider">
              <span>or upload payment screenshot</span>
            </div>

            {/* Screenshot upload / preview */}
            {screenshot ? (
              <div className="screenshot-preview">
                <img
                  src={screenshot.preview}
                  alt="Payment screenshot"
                  className="screenshot-img"
                />
                <div className="screenshot-meta">
                  <span className="screenshot-name">{screenshot.file.name}</span>
                  <button className="screenshot-remove" onClick={removeScreenshot}>
                    ✕ Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`screenshot-dropzone${dragOver ? ' dragover' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="dropzone-icon">📎</span>
                <p className="dropzone-text">
                  Drag & drop screenshot, or <span className="dropzone-browse">browse</span>
                </p>
                <p className="dropzone-subtext">PNG, JPG, WEBP supported</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </div>
            )}

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