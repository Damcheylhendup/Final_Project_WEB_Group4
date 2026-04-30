import './DashboardPage.css';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaHistory, FaMapMarkedAlt, FaWallet } from 'react-icons/fa';

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-logo">
            <span className="yellow">RY</span>
            <span className="red">DO</span>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>

        {/* Welcome */}
        <section className="welcome-section">
          <h1>Welcome to Rydo</h1>
          <p>Book rides, track drivers, and manage your trips.</p>
        </section>

        {/* Cards */}
        <section className="dashboard-grid">

          <div className="dashboard-card">
            <h2><FaCar /> Book a Ride</h2>
            <p>Choose pickup and destination to request a ride.</p>
            <button onClick={() => navigate('/booking')}>Book Now</button>
          </div>

          <div className="dashboard-card">
            <h2><FaHistory /> My Trips</h2>
            <p>View your current and past ride history.</p>
            <button onClick={() => navigate('/trips')}>View Trips</button>
          </div>

          <div className="dashboard-card">
            <h2><FaMapMarkedAlt /> Live Tracking</h2>
            <p>Track your driver in real time on the map.</p>
            <button onClick={() => navigate('/map')}>Open Map</button>
          </div>

          <div className="dashboard-card">
            <h2><FaWallet /> Transactions</h2>
            <p>View fare details and payments.</p>
            <button onClick={() => navigate('/Payments')}>View Transactions</button>
          </div>

        </section>
      </div>
    </div>
  );
}

export default DashboardPage;