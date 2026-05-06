import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPage.css';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';

function AuthPage() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateBhutanNumber = (number) => {
    const cleanedPhone = number.replace(/\s+/g, '');
    return /^(17|77|16)\d{6}$/.test(cleanedPhone);
  };

  const handleContinue = () => {
    const cleanedPhone = phone.replace(/\s+/g, '');

    if (!cleanedPhone) {
      setError('Phone number is required');
      return;
    }

    if (!validateBhutanNumber(cleanedPhone)) {
      setError('Enter a valid Bhutan number, e.g. 17660994');
      return;
    }

    navigate('/create-account', {
      state: {
        phone: cleanedPhone,
      },
    });
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
              placeholder="17660994"
              className="phone-input"
              value={phone}
              maxLength="8"
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, '');
                setPhone(onlyNumbers);
                setError('');
              }}
            />
          </div>

          {error && <p className="auth-error-text">{error}</p>}
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
          <button
            className="social-btn"
            onClick={() => navigate('/create-account')}
          >
            <FaGoogle className="icon" />
            <span>Continue with Google</span>
          </button>

          <button
            className="social-btn facebook-btn"
            onClick={() => navigate('/create-account')}
          >
            <FaFacebookF className="icon" />
            <span>Continue with Facebook</span>
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