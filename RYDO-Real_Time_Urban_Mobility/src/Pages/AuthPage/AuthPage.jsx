import './AuthPage.css';

function AuthPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="top-line"></div>

        <div className="logo-box">Ry</div>

        <h1 className="auth-title">Get started with Rydo</h1>

        <div className="input-group">
          <label className="input-label">Mobile number</label>

          <div className="phone-row">
            <div className="country-box">
              <span className="flag">🇧🇹</span>
              <span className="arrow-down">▼</span>
            </div>

            <input
              type="text"
              placeholder="+975 17660994"
              className="phone-input"
            />
          </div>
        </div>

        <button className="continue-btn">Continue</button>

        <div className="divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        <div className="social-buttons">
          <button className="social-btn"> Continue with Apple</button>
          <button className="social-btn">G Continue with Google</button>
          <button className="social-btn facebook-btn">f Continue with Facebook</button>
          <button className="social-btn">✉ Continue with Email</button>
        </div>

        <div className="divider second-divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        <button className="find-account-btn">⌕ Find my account</button>

        <p className="terms-text">
          By continuing, you agree to calls, WhatsApp, or texts from Rydo and its affiliates.
        </p>
      </div>
    </div>
  );
}

export default AuthPage;