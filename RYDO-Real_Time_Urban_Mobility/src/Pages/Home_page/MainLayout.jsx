import React from "react";
import "./MainLayout.css";

const MainLayout = ({ children }) => {
  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-text">RYDO</span>
        </div>

        <nav className="menu">
          <ul>
            <li className="menu-item active">Home</li>
            <li className="menu-item">Wallet</li>
            <li className="menu-item">Transaction Records</li>
            <li className="menu-item">Ride Records</li>
            <li className="menu-item highlight">Book a Ride</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="content">
        <header className="topbar">
          <h2>Dashboard</h2>
        </header>

        <div className="page-content">
          {children || <h1>Welcome to Rydo 🚗</h1>}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;