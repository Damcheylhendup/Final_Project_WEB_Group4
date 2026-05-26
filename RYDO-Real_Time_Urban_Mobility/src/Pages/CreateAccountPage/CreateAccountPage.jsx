import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { registerUser, registerDriver } from '../../api/authApi';
import './CreateAccountPage.css';

function CreateAccountPage() {
  const navigate    = useNavigate();
  const location    = useLocation();
  const passedPhone = location.state?.phone || '';

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: passedPhone, role: 'rider',
    password: '', confirmPassword: '',
    vehicleType: '', vehicleNumber: '', licenseNumber: '',
    bankName: '', accountHolder: '', accountNumber: '', qrImage: '',
  });

  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const isDriver = formData.role === 'driver';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handlePhoneChange = (e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, '');
    setFormData({ ...formData, phone: onlyNumbers });
    setErrors({ ...errors, phone: '' });
  };

  const handleQrUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, qrImage: 'Please upload an image file' });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, qrImage: reader.result }));
      setErrors((prev) => ({ ...prev, qrImage: '' }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};
    const cleanedPhone = formData.phone.replace(/\s+/g, '');

    if (!formData.fullName.trim())       newErrors.fullName = 'Full name is required';
    if (!formData.email.trim())          newErrors.email    = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (!formData.phone.trim())          newErrors.phone    = 'Phone number is required';
    else if (!/^(17|77|16)\d{6}$/.test(cleanedPhone)) newErrors.phone = 'Enter a valid Bhutan number e.g. 17660994';
    if (!formData.password.trim())       newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (isDriver) {
      if (!formData.vehicleType.trim())   newErrors.vehicleType   = 'Vehicle type is required';
      if (!formData.vehicleNumber.trim()) newErrors.vehicleNumber = 'Vehicle number is required';
      if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
      if (!formData.bankName.trim())      newErrors.bankName      = 'Bank name is required';
      if (!formData.accountHolder.trim()) newErrors.accountHolder = 'Account holder name is required';
      if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
      if (!formData.qrImage)             newErrors.qrImage       = 'Payment QR image is required';
    }

    return newErrors;
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length !== 0) return;

    try {
      setLoading(true);

      let response;

      if (isDriver) {
        response = await registerDriver({
          fullName: formData.fullName,
          email:    formData.email,
          phone:    formData.phone.replace(/\s+/g, ''),
          password: formData.password,
          vehicleType:   formData.vehicleType,
          vehicleNumber: formData.vehicleNumber,
          licenseNumber: formData.licenseNumber,
          bankName:      formData.bankName,
          accountHolder: formData.accountHolder,
          accountNumber: formData.accountNumber,
          qrImage:       formData.qrImage,
        });
      } else {
        // Riders go to users table
        response = await registerUser({
          fullName: formData.fullName,
          email:    formData.email,
          phone:    formData.phone.replace(/\s+/g, ''),
          password: formData.password,
        });
      }

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('currentUser', JSON.stringify({
        ...user,
        vehicleType:   isDriver ? formData.vehicleType   : '',
        vehicleNumber: isDriver ? formData.vehicleNumber : '',
        licenseNumber: isDriver ? formData.licenseNumber : '',
        bankName:      isDriver ? formData.bankName      : '',
        accountHolder: isDriver ? formData.accountHolder : '',
        accountNumber: isDriver ? formData.accountNumber : '',
        qrImage:       isDriver ? formData.qrImage       : '',
      }));

      if (user.role === 'driver') {
        navigate('/driver-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setErrors({ email: error.response?.data?.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-page">
      <div className="create-card">
        <div className="create-logo">
          <span className="yellow">RY</span>
          <span className="red">DO</span>
        </div>

        <h1>Create Account</h1>
        <p className="create-subtitle">Choose your role and complete your profile.</p>

        <form className="create-form" onSubmit={handleCreateAccount}>
          <input type="text"  name="fullName" placeholder="Full Name"     value={formData.fullName} onChange={handleChange} />
          {errors.fullName && <p className="error-text">{errors.fullName}</p>}

          <input type="email" name="email"    placeholder="Email Address" value={formData.email}    onChange={handleChange} />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <input type="tel"   name="phone"    placeholder="17660994"       value={formData.phone}    onChange={handlePhoneChange} maxLength="8" />
          {errors.phone && <p className="error-text">{errors.phone}</p>}

          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="rider">Rider / Client</option>
            <option value="driver">Driver</option>
          </select>

          {isDriver && (
            <div className="driver-section">
              <h3>Driver Details</h3>
              <input type="text" name="vehicleType"   placeholder="Vehicle Type e.g. Taxi, Car, Bus" value={formData.vehicleType}   onChange={handleChange} />
              {errors.vehicleType   && <p className="error-text">{errors.vehicleType}</p>}
              <input type="text" name="vehicleNumber" placeholder="Vehicle Number"                    value={formData.vehicleNumber} onChange={handleChange} />
              {errors.vehicleNumber && <p className="error-text">{errors.vehicleNumber}</p>}
              <input type="text" name="licenseNumber" placeholder="License Number"                    value={formData.licenseNumber} onChange={handleChange} />
              {errors.licenseNumber && <p className="error-text">{errors.licenseNumber}</p>}

              <h3>Payment Details</h3>
              <input type="text" name="bankName"      placeholder="Bank Name e.g. BOB, BNB, T Bank"  value={formData.bankName}      onChange={handleChange} />
              {errors.bankName      && <p className="error-text">{errors.bankName}</p>}
              <input type="text" name="accountHolder" placeholder="Account Holder Name"               value={formData.accountHolder} onChange={handleChange} />
              {errors.accountHolder && <p className="error-text">{errors.accountHolder}</p>}
              <input type="text" name="accountNumber" placeholder="Account Number"                    value={formData.accountNumber} onChange={handleChange} />
              {errors.accountNumber && <p className="error-text">{errors.accountNumber}</p>}

              <div className="qr-upload-box">
                <label htmlFor="qrImage">Upload Payment QR</label>
                <input id="qrImage" type="file" accept="image/*" onChange={handleQrUpload} />
                {formData.qrImage && (
                  <div className="qr-preview-box">
                    <img src={formData.qrImage} alt="Payment QR Preview" className="qr-preview-image" />
                    <p>QR uploaded successfully</p>
                  </div>
                )}
                {errors.qrImage && <p className="error-text">{errors.qrImage}</p>}
              </div>
            </div>
          )}

          <input type="password" name="password"        placeholder="Password"         value={formData.password}        onChange={handleChange} />
          {errors.password        && <p className="error-text">{errors.password}</p>}
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}

          <button type="submit" className="create-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="login-text">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}

export default CreateAccountPage;