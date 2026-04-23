import { useState } from 'react';
import { Link } from 'react-router-dom';
import './AuthPage.css';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';

function AuthPage() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    const cleanedPhone = phone.replace(/\s+/g, '');
    const phoneRegex = /^\+975\d{8}$/;

    if (!phone.trim()) {
      setError('Phone number is required');
    } else if (!phoneRegex.test(cleanedPhone)) {
      setError('Enter a valid Bhutan number (e.g. +97517660994)');
    } else {
      setError('');
      alert('Valid number!');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo">
          <span className="yellow">RY</span>
          <span className="red">DO</span>
        </div>

        <h1 className="auth-title">Get started with Rydo</h1>

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
              type="tel"
              placeholder="+975 17660994"
              className="phone-input"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError('');
              }}
            />
          </div>

          {error && <p className="error-text">{error}</p>}
        </div>

        <button className="continue-btn" onClick={handleContinue}>
          Continue
        </button>

        <div className="divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        <div className="social-buttons">
          <button className="social-btn">
            <FaGoogle className="icon" />
            Continue with Google
          </button>

          <button className="social-btn facebook-btn">
            <FaFacebookF className="icon" />
            Continue with Facebook
          </button>
        </div>

        <div className="divider second-divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        <p className="find-account-btn">
          Already have an account? <Link to="/login">Log in</Link>
        </p>

        <p className="terms-text">
          By continuing, you agree to calls, WhatsApp, or texts from Rydo and its affiliates.
        </p>
      </div>
    </div>
  );
}

export default AuthPage;