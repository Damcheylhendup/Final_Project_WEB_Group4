import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccountSettingsPage.css';

function AccountSettingsPage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    fullName: 'Sonam Lindel',
    email: 'sonam@example.com',
    phone: '+975 17660994',
    role: 'Rider',
  });

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: 'English',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSettingsChange = (e) => {
    const { name, type, checked, value } = e.target;

    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully');
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="account-page">
      <div className="account-container">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
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
                value={profile.fullName}
                onChange={handleProfileChange}
                disabled={!isEditing}
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                disabled={!isEditing}
              />

              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                disabled={!isEditing}
              />

              <label>Role</label>
              <select
                name="role"
                value={profile.role}
                onChange={handleProfileChange}
                disabled={!isEditing}
              >
                <option value="Rider">Rider</option>
                <option value="Driver">Driver</option>
              </select>

              {isEditing && (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSave}>
                    Save Changes
                  </button>

                  <button className="cancel-btn" onClick={() => setIsEditing(false)}>
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

                <input
                  type="checkbox"
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

                <input
                  type="checkbox"
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