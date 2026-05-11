import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../../firebase";

const SignupPage = () => {
  const sendTokenToBackend = async (user) => {
    try {
      const token = await user.getIdToken();

      const response = await fetch("http://localhost:5000/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      console.log("Backend response:", data);

      if (data.success) {
        alert("Login + Backend connected successfully!");
      } else {
        alert("Backend verification failed");
      }
    } catch (error) {
      console.error("Error sending token to backend:", error);
      alert("Frontend and backend connection failed");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      console.log("Google button clicked");

      const result = await signInWithPopup(auth, googleProvider);
      
      console.log("Google user:", result.user);
      await sendTokenToBackend(result.user);
    } catch (error) {
      console.error("Google signup error:", error);
      alert(error.message);
    }
  };

  const handleFacebookSignup = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      console.log("Facebook user:", result.user);
      await sendTokenToBackend(result.user);
    } catch (error) {
      console.error("Facebook signup error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="signup-page">
      <style>{` 
        .signup-page {
          width: 100%;
          min-height: 100vh;
          background: #f5f5f5;
          color: #111;
        }

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
        }

        .logo-top-text {
          font-size: 12px;
          color: #f26b2f;
          margin-left: 48px;
          margin-bottom: 2px;
        }

        .logo-main {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logo-symbol {
          font-size: 64px;
          color: #f26b2f;
          font-weight: 700;
        }

        .logo-text {
          font-size: 34px;
          font-weight: 700;
          color: #f26b2f;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 42px;
          color: #5a5a5a;
          font-size: 15px;
          font-weight: 700;
        }

        .nav-links {
          display: flex;
          gap: 40px;
        }

        .nav-links a {
          color: #5a5a5a;
          text-decoration: none;
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
          height: 4px;
          border-radius: 10px;
          background: #666;
        }

        .hero {
          width: 100%;
          height: 210px;
          background: #111;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .breadcrumb {
          color: #fff;
          font-size: 18px;
          margin-bottom: 10px;
        }

        .breadcrumb .active {
          color: #f26b2f;
        }

        .hero h1 {
          color: #fff;
          font-size: 64px;
          font-weight: 300;
        }

        .form-section {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 95px 20px 90px;
        }

        .form-holder {
          width: 100%;
          max-width: 760px;
          text-align: center;
        }

        .form-title {
          font-size: 22px;
          color: #a8a8a8;
          margin-bottom: 18px;
        }

        .avatar-circle {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: #d5d5d5;
          margin: 0 auto;
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
          margin-bottom: 12px;
          font-weight: 500;
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
          padding: 0 18px;
          color: #444;
        }

        .select {
          cursor: pointer;
        }

        .social-login-box {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin: 25px 0;
        }

        .social-btn {
          width: 100%;
          height: 54px;
          border: none;
          border-radius: 8px;
          background: #e5e5e5;
          color: #111;
          font-size: 17px;
          cursor: pointer;
          font-weight: 600;
        }

        .social-btn:hover {
          background: #d8d8d8;
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
        }

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
        }

        .footer-title {
          color: #f26b2f;
          font-size: 26px;
          margin-bottom: 34px;
        }

        .about-text {
          color: #f3f3f3;
          font-size: 18px;
          line-height: 1.65;
        }

        .footer-list {
          list-style: none;
          padding: 0;
        }

        .footer-list li {
          font-size: 18px;
          padding: 16px 0;
        }

        .arrow {
          color: #f26b2f;
        }

        .footer-bottom {
          margin-top: 54px;
          text-align: center;
          padding: 24px 20px 28px;
          font-size: 18px;
          color: #8d8d8d;
        }

        .footer-bottom .brand {
          color: #f26b2f;
        }

        @media (max-width: 768px) {
          .top-header {
            padding: 16px 18px;
          }

          .nav-links {
            display: none;
          }

          .hero h1 {
            font-size: 38px;
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

          .footer-top {
            grid-template-columns: 1fr;
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
                <input className="input" type="text" />
              </div>

              <div className="field">
                <label>Last Name</label>
                <input className="input" type="text" />
              </div>
            </div>

            <div className="field full">
              <label>Email</label>
              <input className="input" type="email" />
            </div>

            <div className="row">
              <div className="field" style={{ flex: "0 0 34%" }}>
                <label>Country Code</label>
                <select className="select">
                  <option>(+975) Bhutan</option>
                  <option>(+91) India</option>
                  <option>(+1) USA</option>
                </select>
              </div>

              <div className="field">
                <label>Mobile Number</label>
                <input className="input" type="text" placeholder="Enter Mobile" />
              </div>
            </div>

            <div className="field full">
              <label>Password</label>
              <input className="input" type="password" />
            </div>

            <div className="field full">
              <label>Confirm Password</label>
              <input className="input" type="password" />
            </div>

            <div className="social-login-box">
              <button
                type="button"
                className="social-btn"
                onClick={handleGoogleSignup}
              >
                Continue with Google
              </button>

              <button
                type="button"
                className="social-btn"
                onClick={handleFacebookSignup}
              >
                Continue with Facebook
              </button>
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
              DrukRide is Bhutan's leading App-powered on-demand, multi-service
              tech platform providing access to services including online Taxi,
              Bus ticket, Airline tickets, food delivery, Tour, and logistics.
            </p>
          </div>

          <div>
            <h3 className="footer-title">EXPLORE</h3>
            <ul className="footer-list">
              <li><span className="arrow">›</span> About Us</li>
              <li><span className="arrow">›</span> Contact Us</li>
              <li><span className="arrow">›</span> Privacy Policy</li>
              <li><span className="arrow">›</span> FAQ</li>
            </ul>
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