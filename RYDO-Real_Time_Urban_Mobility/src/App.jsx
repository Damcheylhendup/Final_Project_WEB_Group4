import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./Pages/LandingPage/LandingPage.jsx";
import AuthPage from "./Pages/AuthPage/AuthPage.jsx";
import SignupPage from "./Pages/SignupPage/SignupPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;