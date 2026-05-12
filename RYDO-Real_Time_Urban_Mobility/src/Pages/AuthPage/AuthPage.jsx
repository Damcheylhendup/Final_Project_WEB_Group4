import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

import './AuthPage.css';

import { FaFacebookF } from 'react-icons/fa';

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

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);

    const googleUser = {
      fullName: decoded.name,
      email: decoded.email,
      profilePicture: decoded.picture,
      phone: phone || '',
      role: 'Rider',
      authProvider: 'google',
    };

    localStorage.setItem(
      'googleUser',
      JSON.stringify(googleUser)
    );

    localStorage.setItem(
      'currentUser',
      JSON.stringify(googleUser)
    );

    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo">
          <span className="yellow">RY</span>
          <span className="red">DO</span>
        </div>

        <h1 className="auth-title">
          Get started with Rydo
        </h1>

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
                const onlyNumbers = e.target.value.replace(
                  /\D/g,
                  ''
                );

                setPhone(onlyNumbers);

                setError('');
              }}
            />
          </div>

          {error && (
            <p className="auth-error-text">
              {error}
            </p>
          )}
        </div>

        <button
          className="continue-btn"
          onClick={handleContinue}
        >
          Continue
        </button>

        <div className="divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        <div className="google-login-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              alert('Google Login Failed');
            }}
          />
        </div>

        <div className="social-buttons">
          <button
            className="social-btn facebook-btn"
            onClick={() =>
              alert('Facebook login coming soon')
            }
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
          Already have an account?{' '}
          <Link to="/login">Log in</Link>
        </p>

        <p className="terms-text">
          By continuing, you agree to calls,
          WhatsApp, or texts from Rydo and its
          affiliates.
        </p>
      </div>
    </div>
  );
}

export default AuthPage;