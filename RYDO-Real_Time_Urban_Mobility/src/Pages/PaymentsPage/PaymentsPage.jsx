import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentsPage.css";
import map from "../../assets/map.jpg";
import qr from "../../assets/qr.png";

function PaymentsPage() {
  const navigate = useNavigate();
  const [latestRide, setLatestRide] = useState(null);
  const [reference, setReference] = useState("");

  useEffect(() => {
    const rides = JSON.parse(localStorage.getItem("rides")) || [];
    if (rides.length > 0) {
      setLatestRide(rides[rides.length - 1]);
    }
  }, []);

  const handlePayment = () => {
    if (!reference.trim()) {
      alert("Please enter payment reference number");
      return;
    }

    alert("Payment submitted successfully");
    navigate("/trips");
  };

  return (
    <div className="payments-page">
      <div className="payments-card">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back
        </button>

        <h1>Transaction Records</h1>

        {/* ✅ Image section */}
        <div className="map-container">
          <img src={map} alt="Map" className="map-image" />
        </div>

        <p className="subtitle">
          View your past transactions and payment history.
        </p>

        {!latestRide ? (
          <div className="empty-payment">
            <h2>No ride found</h2>
            <p>Please book a ride before making payment.</p>
            <button onClick={() => navigate("/booking")}>
              Book Ride
            </button>
          </div>
        ) : (
          <>
            <div className="payment-summary">
              <h2>Ride Summary</h2>
              <p><strong>Pickup:</strong> {latestRide.pickup}</p>
              <p><strong>Destination:</strong> {latestRide.destination}</p>
              <p><strong>Ride Type:</strong> {latestRide.rideType}</p>
              <p><strong>Distance:</strong> {latestRide.distance} km</p>
              <h3>Total: Nu. {latestRide.fare}</h3>
            </div>

            <div className="qr-box">
              <div className="QR-image-container">
               <img src={qr} alt="QR Code" className="QR-image" />
              </div>
              <p>Scan using mBoB / Mpay / Bank app</p>
            </div>

            <input
              type="text"
              placeholder="Enter Payment ID"
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