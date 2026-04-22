import { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
      console.log('Login Data:', formData);
      alert('Login successful');
    }
  };

  return (
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
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <button type="submit" className="login-btn">
            Log In
          </button>
        </form>

        <p className="forgot-text">Forgot password?</p>

        <p className="bottom-text">
  Don’t have an account? <Link to="/auth">Sign up</Link>
</p>
      </div>
    </div>
  );
}

export default LoginPage;