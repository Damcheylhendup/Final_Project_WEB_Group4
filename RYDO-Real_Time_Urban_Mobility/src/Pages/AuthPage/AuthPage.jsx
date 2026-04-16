import './AuthPage.css';
import {FaApple, FaGoogle, FaFacebookF} from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

function AuthPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div className="logo">
          <span className="yellow">RY</span>
          <span className="red">DO</span>
        </div>

        {/* Title */}
        <h1 className="auth-title">Get started with Rydo</h1>

        {/* Input */}
        <div className="input-group">
          <label className="input-label" htmlFor="phone">
            Mobile number
          </label>

          <div className="phone-row">
            <div className="country-box">
              <span className="flag">🇧🇹</span>
              <span className="arrow-down">▼</span>
            </div>

            <input
              id="phone"
              type="tel"   // better for mobile
              placeholder="+975 17660994"
              className="phone-input"
            />
          </div>
        </div>

        {/* Continue */}
        <button className="continue-btn">Continue</button>

        {/* Divider */}
        <div className="divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        {/* Social Buttons */}
        <div className="social-buttons">
  <button className="social-btn">
    <FaApple className="icon" /> Continue with Apple
  </button>

  <button className="social-btn">
    <FaGoogle className="icon" /> Continue with Google
  </button>

  <button className="social-btn facebook-btn">
    <FaFacebookF className="icon" /> Continue with Facebook
  </button>

  <button className="social-btn">
    <MdEmail className="icon" /> Continue with Email
  </button>
</div>
        {/* Second Divider */}
        <div className="divider second-divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        {/* Find Account */}
        <button className="find-account-btn">⌕ Find my account</button>

        {/* Terms */}
        <p className="terms-text">
          By continuing, you agree to calls, WhatsApp, or texts from Rydo and its affiliates.
        </p>
      </div>
    </div>
  );
}

export default AuthPage;