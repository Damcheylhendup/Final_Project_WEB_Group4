import { useState, useRef, useEffect } from "react";
import "./ForgotPassword.css";

const DEMO_OTP = "1234";

export default function ForgotPassword({ isOpen, onClose }) {
  const [sheetVisible, setSheetVisible] = useState(false);
  const [step, setStep] = useState("input"); // input | otp | success
  const [contact, setContact] = useState("");
  const [contactError, setContactError] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef(null);
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (isOpen) {
      setStep("input");
      setContact("");
      setContactError("");
      setOtp(["", "", "", ""]);
      setOtpError("");
      requestAnimationFrame(() => setSheetVisible(true));
    } else {
      setSheetVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setSheetVisible(false);
    clearInterval(timerRef.current);
    setTimeout(() => onClose(), 350);
  };

  const startTimer = () => {
    setTimer(30);
    setCanResend(false);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const sendOtp = () => {
    if (!contact.trim()) {
      setContactError("Please enter your email or phone number.");
      return;
    }
    setContactError("");
    setOtp(["", "", "", ""]);
    setOtpError("");
    setStep("otp");
    startTimer();
    setTimeout(() => otpRefs[0].current?.focus(), 100);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");
    if (value && index < 3) otpRefs[index + 1].current?.focus();
    if (newOtp.every((d) => d !== "") && value) verifyOtp(newOtp);
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const verifyOtp = (otpArr = otp) => {
    const entered = otpArr.join("");
    if (entered === DEMO_OTP) {
      clearInterval(timerRef.current);
      setStep("success");
    } else {
      setOtpError("Incorrect OTP. Please try again.");
      setOtp(["", "", "", ""]);
      setTimeout(() => otpRefs[0].current?.focus(), 50);
    }
  };

  const resendOtp = () => {
    setOtp(["", "", "", ""]);
    setOtpError("");
    startTimer();
    setTimeout(() => otpRefs[0].current?.focus(), 50);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fp-overlay ${sheetVisible ? "fp-overlay--visible" : ""}`}
        onClick={handleClose}
      />

      {/* Bottom Sheet */}
      <div className={`fp-sheet ${sheetVisible ? "fp-sheet--visible" : ""}`}>
        <div className="fp-pill" />

        {/* Step 1: Enter contact */}
        {step === "input" && (
          <div className="fp-step">
            <h2 className="fp-title">Forgot password?</h2>
            <p className="fp-subtitle">
              Enter your email or phone number and we'll send you a
              verification code.
            </p>

            <input
              className={`fp-input ${contactError ? "fp-input--error" : ""}`}
              type="text"
              placeholder="Email or Phone Number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendOtp()}
            />
            {contactError && (
              <p className="fp-error-hint">{contactError}</p>
            )}

            <button className="fp-btn-primary" onClick={sendOtp}>
              Send OTP
            </button>
            <button className="fp-btn-ghost" onClick={handleClose}>
              Cancel
            </button>
          </div>
        )}

        {/* Step 2: Enter OTP */}
        {step === "otp" && (
          <div className="fp-step">
            <h2 className="fp-title">Enter OTP</h2>
            <p className="fp-subtitle">
              We sent a 4-digit code to{" "}
              <strong className="fp-contact">{contact}</strong>. Enter it
              below.
            </p>

            <div className="fp-otp-row">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={otpRefs[i]}
                  className={`fp-otp-box ${otpError ? "fp-otp-box--error" : ""} ${digit ? "fp-otp-box--filled" : ""}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                />
              ))}
            </div>

            {otpError && (
              <p className="fp-error-hint fp-error-hint--center">{otpError}</p>
            )}

            <button className="fp-btn-primary" onClick={() => verifyOtp()}>
              Verify OTP
            </button>

            <div className="fp-resend-row">
              {canResend ? (
                <>
                  Didn't receive it?{" "}
                  <button className="fp-resend-btn" onClick={resendOtp}>
                    Resend OTP
                  </button>
                </>
              ) : (
                <>
                  Resend OTP in{" "}
                  <span className="fp-timer">
                    0:{String(timer).padStart(2, "0")}
                  </span>
                </>
              )}
            </div>

            <p className="fp-demo-hint">
              Demo OTP: <strong>1234</strong>
            </p>
          </div>
        )}

        {/* Step 3: Success */}
        {step === "success" && (
          <div className="fp-step fp-step--center">
            <div className="fp-success-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="#1D9E75"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="fp-title">Identity verified!</h2>
            <p className="fp-subtitle">
              Your identity has been confirmed. You can now reset your
              password.
            </p>
            <button className="fp-btn-primary">Set new password</button>
            <button className="fp-btn-ghost" onClick={handleClose}>
              Back to login
            </button>
          </div>
        )}
      </div>
    </>
  );
}