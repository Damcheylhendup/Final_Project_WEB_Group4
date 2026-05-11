import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1 className="logo">
          <span className="yellow">RY</span>
          <span className="orange">DO</span>
        </h1>

        <h2 className="subtitle">Real-Time Urban Mobility</h2>

        <div className="bottom-section">
          <button className="start-btn">
            Get Started <span>→</span>
          </button>

          <p className="tagline">"Get in, go out — སྐྱིད vibes."</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;