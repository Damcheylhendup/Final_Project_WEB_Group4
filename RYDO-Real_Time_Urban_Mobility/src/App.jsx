import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import LandingPage from "./Pages/LandingPage/LandingPage.jsx";
import LoginPage from "./Pages/LoginPage/LoginPage.jsx";
import AuthPage from "./Pages/AuthPage/AuthPage.jsx";
import DashboardPage from "./Pages/DashboardPage/DashboardPage.jsx";
import BookingPage from "./Pages/BookingPage/BookingPage.jsx";
import TripsPage from "./Pages/TripsPage/TripsPage.jsx";
import PaymentsPage from "./Pages/PaymentsPage/PaymentsPage.jsx";
import MapPage from "./Pages/MapPage/MapPage.jsx";
import AccountSettingsPage from "./Pages/AccountSettingsPage/AccountSettingsPage.jsx";

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

  return (
    <>
      {loading && <Loading />}

      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/account" element={<AccountSettingsPage />} />
      </Routes>
    </>
  );

export default AppWrapper;