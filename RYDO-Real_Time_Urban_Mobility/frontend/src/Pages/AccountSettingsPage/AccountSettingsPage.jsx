import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccountSettingsPage.css';
import ThemeToggle from "../../components/ThemeToggle";

function AccountSettingsPage() {
  const navigate = useNavigate();

  const raw = JSON.parse(localStorage.getItem('currentUser')) || {};

  // Normalize: backend returns paymentName/paymentNumber, frontend uses bankName/accountHolder/accountNumber
  const savedUser = {
    fullName:      raw.fullName      || 'User',
    email:         raw.email         || '',
    phone:         raw.phone         || '',
    role:          raw.role          || 'rider',
    vehicleType:   raw.vehicleType   || '',
    vehicleNumber: raw.vehicleNumber || '',
    licenseNumber: raw.licenseNumber || '',
    bankName:      raw.bankName      || raw.paymentName   || '',
    accountHolder: raw.accountHolder || raw.paymentName   || '',
    accountNumber: raw.accountNumber || raw.paymentNumber || '',
    qrImage:       raw.qrImage       || raw.qrCodeUrl     || '',
  };

  const [profile, setProfile] = useState(savedUser);

  const [settings, setSettings] = useState(() => ({
    notifications: true,
    darkMode: localStorage.getItem('darkMode') === 'true',
    language: 'English',
  }));

  const [isEditing, setIsEditing] = useState(false);

  const isDriver = profile.role === 'driver';

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', settings.darkMode);
    localStorage.setItem('darkMode', String(settings.darkMode));
  }, [settings.darkMode]);

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleQrUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfile((prev) => ({
        ...prev,
        qrImage: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSettingsChange = (e) => {
    const { name, type, checked, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    const cleanedPhone = profile.phone.replace(/\s+/g, '');

    if (!profile.fullName.trim()) {
      alert('Full name is required');
      return;
    }

    if (!profile.email.trim()) {
      alert('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      alert('Enter a valid email address');
      return;
    }

    if (!/^(17|77|16)\d{6}$/.test(cleanedPhone)) {
      alert('Enter a valid Bhutan number, e.g. 17660994');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const updatedUser = {
      ...profile,
      phone: cleanedPhone,
      role: savedUser.role,
    };

    const updatedUsers = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    setProfile(updatedUser);
    setIsEditing(false);
    alert('Profile updated successfully');
  };

  const handleCancel = () => {
    const latestUser = JSON.parse(localStorage.getItem('currentUser')) || savedUser;
    setProfile(latestUser);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const handleBack = () => {
    if (profile.role === 'driver') {
      navigate('/driver-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="account-page">
      <div className="account-container">
        <button className="back-btn" onClick={handleBack}>
          ← Back
        </button>

        <div className="account-header">
          <div className="account-logo">
            <span className="yellow">RY</span>
            <span className="red">DO</span>
          </div>

          <div>
            <h1>Account & Settings</h1>
            <p>Manage your profile and app preferences.</p>
          </div>
        </div>

        <div className="account-grid">
          <section className="account-card">
            <div className="card-title-row">
              <h2>Account Information</h2>

              {!isEditing && (
                <button className="small-btn" onClick={() => setIsEditing(true)}>
                  Edit
                </button>
              )}
            </div>

            <div className="profile-form">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={profile.fullName || ''}
                onChange={handleProfileChange}
                disabled={!isEditing}
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profile.email || ''}
                onChange={handleProfileChange}
                disabled={!isEditing}
              />

              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={profile.phone || ''}
                onChange={handleProfileChange}
                disabled={!isEditing}
                maxLength="8"
              />

              <label>Role</label>
              <input
                type="text"
                value={profile.role === 'driver' ? 'Driver' : 'Rider'}
                disabled
              />

              {isDriver && (
                <div className="driver-account-section">
                  <h3>Driver Details</h3>

                  <label>Vehicle Type</label>
                  <input
                    type="text"
                    name="vehicleType"
                    value={profile.vehicleType || ''}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                  />

                  <label>Vehicle Number</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={profile.vehicleNumber || ''}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                  />

                  <label>License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={profile.licenseNumber || ''}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                  />

                  <h3>Payment Details</h3>

                  <label>Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={profile.bankName || ''}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                  />

                  <label>Account Holder Name</label>
                  <input
                    type="text"
                    name="accountHolder"
                    value={profile.accountHolder || ''}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                  />

                  <label>Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={profile.accountNumber || ''}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                  />

                  <label>Payment QR</label>

                  {profile.qrImage ? (
                    <div className="settings-qr-preview">
                      <img
                        src={profile.qrImage}
                        alt="Driver payment QR"
                        className="settings-qr-image"
                      />
                    </div>
                  ) : (
                    <p className="no-qr-text">No QR uploaded yet.</p>
                  )}

                  {isEditing && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQrUpload}
                      className="settings-file-input"
                    />
                  )}
                </div>
              )}

              {isEditing && (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSave}>
                    Save Changes
                  </button>

                  <button className="cancel-btn" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="account-card">
            <h2>Settings</h2>

            <div className="settings-list">
              <div className="setting-item">
                <div>
                  <h3>Notifications</h3>
                  <p>Receive ride updates and payment alerts.</p>
                </div>

                <ThemeToggle
                  name="notifications"
                  checked={settings.notifications}
                  onChange={handleSettingsChange}
                />
              </div>

              <div className="setting-item">
                <div>
                  <h3>Dark Mode</h3>
                  <p>Switch app appearance to dark mode.</p>
                </div>
                
                <ThemeToggle
                  name="darkMode"
                  checked={settings.darkMode}
                  onChange={handleSettingsChange}
                />

              </div>

              <div className="setting-item language-row">
                <div>
                  <h3>Language</h3>
                  <p>Choose your preferred app language.</p>
                </div>

                <select
                  name="language"
                  value={settings.language}
                  onChange={handleSettingsChange}
                >
                  <option value="English">English</option>
                  <option value="Dzongkha">Dzongkha</option>
                </select>
              </div>
            </div>

            <button className="logout-main-btn" onClick={handleLogout}>
              Logout
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AccountSettingsPage;