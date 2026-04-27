import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage/LandingPage.jsx';
import LoginPage from './Pages/LoginPage/LoginPage.jsx';
import AuthPage from './Pages/AuthPage/AuthPage.jsx';
import DashboardPage from './Pages/DashboardPage/DashboardPage.jsx';
import BookingPage from './Pages/BookingPage/BookingPage.jsx';
import TripsPage from './Pages/TripsPage/TripsPage.jsx';
import PaymentsPage from './Pages/PaymentsPage/PaymentsPage.jsx';
import MapPage from './Pages/MapPage/MapPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </Router>
  );
}

export default App;