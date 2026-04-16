import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="splash-screen">
      <div className="content">
        <h1 className="logo box">
          <span className="yellow">RY</span>
          <span className="red">DO</span>
        </h1>

        <p className="tagline">Real-Time Urban Mobility</p>

        <button className="start-btn" onClick={() => navigate('/auth')}>
          Get Started <span className="arrow">→</span>
        </button>

        <p className="subtag">"Get in, go out — འགྱོ་བ vibes."</p>
      </div>
    </div>
  );
}

export default LandingPage;