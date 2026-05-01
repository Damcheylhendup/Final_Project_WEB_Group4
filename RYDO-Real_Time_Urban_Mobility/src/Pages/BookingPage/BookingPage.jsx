import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookingPage.css';

function BookingPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pickup: '',
    destination: '',
    rideType: 'Car',
  });

  const [fare, setFare] = useState(null);
  const [error, setError] = useState('');

  const rates = {
    Car: 80,
    Taxi: 100,
    Bus: 20,
  };

  const rideOptions = [
  {
    type: 'Car',
    icon: '🚗',
    label: 'Car',
    description: 'Comfort ride',
  },
  {
    type: 'Taxi',
    icon: '🚕',
    label: 'Taxi',
    description: 'Standard taxi',
  },
  {
    type: 'Bus',
    icon: '🚌',
    label: 'Bus',
    description: 'Affordable group ride',
  },
];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setFare(null);
    setError('');
  };

  const handleRideTypeSelect = (type) => {
    setFormData({
      ...formData,
      rideType: type,
    });

    setFare(null);
    setError('');
  };

  const calculateFare = () => {
    if (!formData.pickup.trim() || !formData.destination.trim()) {
      setError('Pickup and destination are required');
      return;
    }

    const estimatedDistance = Math.floor(Math.random() * 10) + 3;
    const estimatedFare = estimatedDistance * rates[formData.rideType];

    setFare({
      distance: estimatedDistance,
      amount: estimatedFare,
    });
  };

  const confirmRide = () => {
    if (!fare) {
      setError('Please calculate fare first');
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const ride = {
      id: Date.now(),
      riderId: currentUser?.id || null,
      riderName: currentUser?.fullName || 'Guest Rider',
      pickup: formData.pickup,
      destination: formData.destination,
      rideType: formData.rideType,
      distance: fare.distance,
      fare: fare.amount,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      driverName: '',
      date: new Date().toLocaleString(),
    };

    const existingRides = JSON.parse(localStorage.getItem('rides')) || [];

    localStorage.setItem('rides', JSON.stringify([...existingRides, ride]));

    alert('Ride request sent to drivers');
    navigate('/trips');
  };

  return (
    <div className="booking-page">
      <div className="booking-card">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back
        </button>

        <h1>Book a Ride</h1>
        <p className="subtitle">Enter your pickup and destination details.</p>

        <div className="booking-form">
          <input
            type="text"
            name="pickup"
            placeholder="Pickup location"
            value={formData.pickup}
            onChange={handleChange}
          />

          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={formData.destination}
            onChange={handleChange}
          />

          <div className="ride-type-section">
            <p className="ride-type-label">Choose ride type</p>

            <div className="ride-options">
              {rideOptions.map((option) => (
                <button
                  key={option.type}
                  type="button"
                  className={
                    formData.rideType === option.type
                      ? 'ride-option selected'
                      : 'ride-option'
                  }
                  onClick={() => handleRideTypeSelect(option.type)}
                >
                  <span className="ride-icon">{option.icon}</span>

                  <span className="ride-text">
                    <strong>{option.label}</strong>
                    <small>{option.description}</small>
                  </span>

                  <span className="ride-price">Nu. {rates[option.type]}/km</span>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="calculate-btn" onClick={calculateFare}>
            Calculate Fare
          </button>
        </div>

        {fare && (
          <div className="fare-box">
            <h2>Estimated Fare</h2>
            <p>Distance: {fare.distance} km</p>
            <p>Ride Type: {formData.rideType}</p>
            <h3>Nu. {fare.amount}</h3>

            <button className="confirm-btn" onClick={confirmRide}>
              Confirm Ride
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingPage;