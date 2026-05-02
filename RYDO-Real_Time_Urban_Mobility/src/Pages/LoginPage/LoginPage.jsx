import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showForgot, setShowForgot] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email or phone is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const users = JSON.parse(localStorage.getItem('users')) || [];

      const matchedUser = users.find(
        (user) =>
          (user.email === formData.emailOrPhone ||
            user.phone.replace(/\s+/g, '') ===
              formData.emailOrPhone.replace(/\s+/g, '')) &&
          user.password === formData.password
      );

      if (!matchedUser) {
        setErrors({
          emailOrPhone: 'Invalid email/phone or password',
        });
        return;
      }

      localStorage.setItem('currentUser', JSON.stringify(matchedUser));

      if (matchedUser.role === 'driver') {
        navigate('/driver-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">RYDO</div>

          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Log in to continue using Rydo</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                name="emailOrPhone"
                placeholder="Email or Phone Number"
                value={formData.emailOrPhone}
                onChange={handleChange}
                className="login-input"
              />
              {errors.emailOrPhone && (
                <p className="error-text">{errors.emailOrPhone}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="login-input"
              />
              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}
            </div>

            <button type="submit" className="login-btn">
              Log In
            </button>
          </form>

          <p className="forgot-text" onClick={() => setShowForgot(true)}>
            Forgot password?
          </p>

          <p className="bottom-text">
            Don’t have an account? <Link to="/auth">Sign up</Link>
          </p>
        </div>
      </div>

      <ForgotPassword
        isOpen={showForgot}
        onClose={() => setShowForgot(false)}
      />
    </>
  );
}

export default LoginPage;