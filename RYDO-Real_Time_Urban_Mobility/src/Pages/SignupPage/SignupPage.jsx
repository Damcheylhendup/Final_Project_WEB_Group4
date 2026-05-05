import React from "react";

const SignupPage = () => {
  return (
    <div className="signup-page">
      <style>{` 
        .signup-page {
          width: 100%;
          min-height: 100vh;
          background: #f5f5f5;
          color: #111;
        }

        /* HEADER */
        .top-header {
          width: 100%;
          background: #efefef;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 80px 16px 80px;
        }

        .logo-wrap {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
        }

        .logo-top-text {
          font-size: 12px;
          color: #f26b2f;
          margin-left: 48px;
          margin-bottom: 2px;
          letter-spacing: 0.4px;
        }

        .logo-main {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logo-symbol {
          font-size: 64px;
          line-height: 1;
          color: #f26b2f;
          font-weight: 700;
          transform: translateY(-2px);
        }

        .logo-text {
          font-size: 34px;
          font-weight: 700;
          color: #f26b2f;
          letter-spacing: 0.5px;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 42px;
          color: #5a5a5a;
          font-size: 15px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 40px;
        }

        .menu-icon {
          width: 44px;
          height: 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: pointer;
        }

        .menu-icon span {
          display: block;
          height: 4px;
          border-radius: 10px;
          background: #666;
        }

        /* HERO */
        .hero {
          width: 100%;
          height: 210px;
          background:
            linear-gradient(rgba(12,12,12,0.96), rgba(12,12,12,0.96)),
            repeating-linear-gradient(
              -45deg,
              #1a1a1a 0px,
              #1a1a1a 2px,
              #111 2px,
              #111 5px
            );
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .breadcrumb {
          color: #ffffff;
          font-size: 18px;
          margin-bottom: 10px;
        }

        .breadcrumb .active {
          color: #f26b2f;
        }

        .hero h1 {
          color: #ffffff;
          font-size: 64px;
          font-weight: 300;
          letter-spacing: 1px;
        }

        /* FORM SECTION */
        .form-section {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 95px 20px 90px;
          background: #f5f5f5;
        }

        .form-holder {
          width: 100%;
          max-width: 760px;
          text-align: center;
          position: relative;
        }

        .form-title {
          font-size: 22px;
          color: #a8a8a8;
          margin-bottom: 18px;
          font-weight: 400;
        }

        .avatar-circle {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: #d5d5d5;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          transform: translateY(48px);
        }

        .form-card {
          background: #f7f7f7;
          border-radius: 12px;
          box-shadow: 0 8px 22px rgba(0,0,0,0.06);
          padding: 88px 38px 48px;
          text-align: left;
        }

        .row {
          display: flex;
          gap: 24px;
          margin-bottom: 30px;
        }

        .field {
          flex: 1;
        }

        .field.full {
          width: 100%;
          margin-bottom: 30px;
        }

        .field label {
          display: block;
          font-size: 18px;
          color: #111;
          margin-bottom: 12px;
          font-weight: 500;
        }

        .input-wrap,
        .select-wrap {
          position: relative;
        }

        .input,
        .select {
          width: 100%;
          height: 54px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          background: #f7f7f7;
          outline: none;
          font-size: 16px;
          padding: 0 48px 0 18px;
          color: #444;
        }

        .input::placeholder {
          color: #ababab;
        }

        .select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          cursor: pointer;
        }

        .input-icon,
        .select-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #c4c4c4;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .submit-wrap {
          display: flex;
          justify-content: center;
          margin-top: 18px;
        }

        .submit-btn {
          background: #17171b;
          color: #fff;
          border: none;
          border-radius: 999px;
          padding: 16px 34px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          min-width: 132px;
          transition: 0.25s ease;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          opacity: 0.96;
        }

        /* FOOTER */
        .footer {
          background: #09090d;
          color: #fff;
          padding: 64px 70px 0;
        }

        .footer-top {
          max-width: 1460px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.3fr 1.5fr 1fr;
          gap: 70px;
          align-items: start;
        }

        .footer-title {
          color: #f26b2f;
          font-size: 26px;
          font-weight: 500;
          margin-bottom: 34px;
          text-transform: uppercase;
        }

        .about-text {
          color: #f3f3f3;
          opacity: 0.96;
          font-size: 18px;
          line-height: 1.65;
          max-width: 520px;
        }

        .socials {
          display: flex;
          align-items: center;
          gap: 22px;
          margin-top: 56px;
        }

        .socials a {
          color: #f26b2f;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .explore-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 36px;
        }

        .footer-list {
          list-style: none;
        }

        .footer-list li {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #f4f4f4;
          font-size: 18px;
          padding: 16px 0;
          border-bottom: 1px dotted rgba(255,255,255,0.12);
        }

        .arrow {
          color: #f26b2f;
          flex-shrink: 0;
          font-size: 18px;
          line-height: 1;
        }

        .footer-bottom {
          margin-top: 54px;
          border-top: 1px solid rgba(255,255,255,0.06);
          text-align: center;
          padding: 24px 20px 28px;
          font-size: 18px;
          color: #8d8d8d;
        }

        .footer-bottom .brand {
          color: #f26b2f;
        }

        /* SVG ICON SIZE */
        .svg-icon {
          width: 24px;
          height: 24px;
        }

        .svg-small {
          width: 22px;
          height: 22px;
        }

        /* RESPONSIVE */
        @media (max-width: 1200px) {
          .top-header {
            padding: 18px 40px 16px 40px;
          }

          .hero h1 {
            font-size: 54px;
          }

          .footer-top {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .top-header {
            padding: 16px 18px;
          }

          .logo-symbol {
            font-size: 52px;
          }

          .logo-text {
            font-size: 26px;
          }

          .logo-top-text {
            margin-left: 35px;
            font-size: 10px;
          }

          .nav-links {
            display: none;
          }

          .hero {
            height: 190px;
            padding: 0 16px;
          }

          .hero h1 {
            font-size: 38px;
          }

          .breadcrumb {
            font-size: 16px;
          }

          .form-section {
            padding: 70px 14px 70px;
          }

          .form-card {
            padding: 82px 18px 38px;
          }

          .row {
            flex-direction: column;
            gap: 0;
            margin-bottom: 0;
          }

          .field {
            margin-bottom: 22px;
          }

          .footer {
            padding: 50px 20px 0;
          }

          .explore-grid {
            grid-template-columns: 1fr;
          }

          .footer-title {
            font-size: 24px;
          }

          .about-text {
            font-size: 17px;
          }
        }
      `}</style>

      <header className="top-header">
        <div className="logo-wrap">
          <div className="logo-top-text">འབྲུག་རིད།</div>
          <div className="logo-main">
            <div className="logo-symbol">∿</div>
            <div className="logo-text">DrukRide</div>
          </div>
        </div>

        <div className="nav-right">
          <nav className="nav-links">
            <a href="/">LOGIN</a>
            <a href="/">REGISTER</a>
          </nav>

          <div className="menu-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="breadcrumb">
          Home <span className="active">// Create Account</span>
        </div>
        <h1>CREATE ACCOUNT</h1>
      </section>

      <section className="form-section">
        <div className="form-holder">
          <div className="form-title">Enter Your Personal Detail</div>
          <div className="avatar-circle"></div>

          <div className="form-card">
            <div className="row">
              <div className="field">
                <label>First Name</label>
                <div className="input-wrap">
                  <input className="input" type="text" />
                  <div className="input-icon">
                    <svg className="svg-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21a8 8 0 0 0-16 0"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="field">
                <label>Last Name</label>
                <div className="input-wrap">
                  <input className="input" type="text" />
                  <div className="input-icon">
                    <svg className="svg-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21a8 8 0 0 0-16 0"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="field full">
              <label>Email</label>
              <div className="input-wrap">
                <input className="input" type="email" />
                <div className="input-icon">
                  <svg className="svg-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                    <path d="M3 7l9 6 9-6"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="field" style={{ flex: "0 0 34%" }}>
                <label>Country Code</label>
                <div className="select-wrap">
                  <select className="select">
                    <option>(+975) Bhutan</option>
                    <option>(+91) India</option>
                    <option>(+1) USA</option>
                  </select>
                  <div className="select-icon">▼</div>
                </div>
              </div>

              <div className="field">
                <label>Mobile Number</label>
                <div className="input-wrap">
                  <input
                    className="input"
                    type="text"
                    placeholder="Enter Mobile"
                  />
                </div>
              </div>
            </div>

            <div className="field full">
              <label>Password</label>
              <div className="input-wrap">
                <input className="input" type="password" />
                <div className="input-icon">
                  <svg className="svg-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="11" width="14" height="10" rx="2"></rect>
                    <path d="M8 11V8a4 4 0 1 1 8 0v3"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="field full">
              <label>Confirm Password</label>
              <div className="input-wrap">
                <input className="input" type="password" />
                <div className="input-icon">
                  <svg className="svg-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="11" width="14" height="10" rx="2"></rect>
                    <path d="M8 11V8a4 4 0 1 1 8 0v3"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="submit-wrap">
              <button className="submit-btn">Submit</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-top">
          <div>
            <h3 className="footer-title">ABOUT US</h3>
            <p className="about-text">
              DrukRide is Bhutan's leading App-powered on-demand,
              multi-service tech platform providing access to a wide range of
              services including online Taxi, Bus ticket, Airline tickets,
              food delivery, Tour, and logistics.
            </p>

            <div className="socials">
              <a href="/">
                <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 5.8c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.2 1.7-2.1-.8.5-1.7.8-2.6 1-1.5-1.6-4.2-1.7-5.8-.2-1 .9-1.4 2.3-1.1 3.6-3-.2-5.8-1.6-7.7-3.8-1 1.7-.5 3.9 1.1 5-.6 0-1.2-.2-1.7-.5 0 1.9 1.3 3.5 3.2 3.9-.6.2-1.2.2-1.8.1.5 1.6 2.1 2.8 3.8 2.8A7.9 7.9 0 0 1 2 18.6a11.2 11.2 0 0 0 6.1 1.8c7.3 0 11.5-6.2 11.2-11.8.8-.5 1.5-1.2 2-2z" />
                </svg>
              </a>

              <a href="/">
                <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.8 3.7-3.8 1.1 0 2.2.2 2.2.2v2.4H15c-1.2 0-1.6.8-1.6 1.5V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" />
                </svg>
              </a>

              <a href="/">
                <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2.2A2.8 2.8 0 0 0 4.2 7v10A2.8 2.8 0 0 0 7 19.8h10a2.8 2.8 0 0 0 2.8-2.8V7A2.8 2.8 0 0 0 17 4.2H7zm10.8 1.6a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6z" />
                </svg>
              </a>

              <a href="/">
                <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.9 8.5a1.6 1.6 0 1 1 0-3.3 1.6 1.6 0 0 1 0 3.3zM5.5 9.8h2.8V18H5.5V9.8zm4.4 0h2.7V11h.1c.4-.7 1.3-1.4 2.7-1.4 2.9 0 3.4 1.9 3.4 4.4V18H16V14.6c0-.8 0-1.9-1.2-1.9s-1.4.9-1.4 1.8V18H9.9V9.8z" />
                </svg>
              </a>

              <a href="/">
                <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 7.2s-.2-1.7-.9-2.4c-.9-.9-1.9-.9-2.4-1C16.3 3.5 12 3.5 12 3.5h0s-4.3 0-7.7.3c-.5.1-1.5.1-2.4 1C1.2 5.5 1 7.2 1 7.2S.8 9.1.8 11v1.8c0 1.9.2 3.8.2 3.8s.2 1.7.9 2.4c.9.9 2.1.9 2.7 1 1.9.2 7.4.3 7.4.3s4.3 0 7.7-.3c.5-.1 1.5-.1 2.4-1 .7-.7.9-2.4.9-2.4s.2-1.9.2-3.8V11c0-1.9-.2-3.8-.2-3.8zM9.6 15.1V8.9l6 3.1-6 3.1z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="footer-title">EXPLORE</h3>

            <div className="explore-grid">
              <ul className="footer-list">
                <li><span className="arrow">›</span> About Us</li>
                <li><span className="arrow">›</span> Contact Us</li>
                <li><span className="arrow">›</span> DrukRide on Mobile</li>
              </ul>

              <ul className="footer-list">
                <li><span className="arrow">›</span> T &amp; C</li>
                <li><span className="arrow">›</span> Privacy Policy</li>
                <li><span className="arrow">›</span> FAQ</li>
                <li><span className="arrow">›</span> Blog</li>
                <li><span className="arrow">›</span> Agent Registration</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="footer-title">GLOBAL SITES</h3>
            <ul className="footer-list">
              <li><span className="arrow">›</span> India</li>
              <li><span className="arrow">›</span> Bhutan</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="brand">Drukride</span> 2022 © All Rights Reserved
        </div>
      </footer>
    </div>
  );
};

export default SignupPage;