import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage/LandingPage.jsx';
import LoginPage from './Pages/LoginPage/LoginPage.jsx';
import AuthPage from './Pages/AuthPage/AuthPage.jsx';
import DashboardPage from './Pages/DashboardPage/DashboardPage.jsx';
import BookingPage from './Pages/BookingPage/BookingPage.jsx';
import TripsPage from './Pages/TripsPage/TripsPage.jsx';
import PaymentsPage from './Pages/PaymentsPage/PaymentsPage.jsx';
import MapPage from './Pages/MapPage/MapPage.jsx';
import AccountSettingsPage from './Pages/AccountSettingsPage/AccountSettingsPage.jsx';
import CreateAccountPage from './Pages/CreateAccountPage/CreateAccountPage.jsx';
import DriverDashboardPage from './Pages/DriverDashboardPage/DriverDashboardPage.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/dashboard" element={<ProtectedRoute allowedRole="rider"><DashboardPage /></ProtectedRoute>} />
        <Route path="/booking" element={<ProtectedRoute allowedRole="rider"><BookingPage /></ProtectedRoute>} />
        <Route path="/trips" element={<ProtectedRoute allowedRole="rider"><TripsPage /></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute allowedRole="rider"><PaymentsPage /></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute allowedRole="rider"><MapPage /></ProtectedRoute>} />
        <Route path="/driver-dashboard" element={<ProtectedRoute allowedRole="driver"><DriverDashboardPage /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><AccountSettingsPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;