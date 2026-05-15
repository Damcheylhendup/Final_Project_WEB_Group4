import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/authApi';
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ emailOrPhone: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.emailOrPhone.trim()) newErrors.emailOrPhone = 'Email or phone is required';
    if (!formData.password.trim())     newErrors.password     = 'Password is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      const response = await loginUser(formData);
      const { token, user } = response.data;

      /* Save token and user to localStorage */
      localStorage.setItem('token', token);
      localStorage.setItem('currentUser', JSON.stringify({ ...user, role: user.role || 'rider' }));

      if (user.role === 'driver') {
        navigate('/driver-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setErrors({ emailOrPhone: error.response?.data?.message || 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            <span className="yellow">RY</span>
            <span className="red">DO</span>
          </div>

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
              {errors.emailOrPhone && <p className="error-text">{errors.emailOrPhone}</p>}
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

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="forgot-text" onClick={() => setShowForgot(true)}>Forgot password?</p>
          <p className="bottom-text">Don't have an account? <Link to="/auth">Sign up</Link></p>
        </div>
      </div>

      <ForgotPassword isOpen={showForgot} onClose={() => setShowForgot(false)} />
    </>
  );
}

export default LoginPage;