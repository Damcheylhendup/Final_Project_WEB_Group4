-- ============================================================
-- OTP (PHONE / EMAIL VERIFICATION)
-- ============================================================
CREATE TABLE otp_verifications (
    otp_id           INT AUTO_INCREMENT PRIMARY KEY,

    -- Who the OTP belongs to
    recipient_type   ENUM('user', 'driver', 'admin') NOT NULL,
    recipient_number VARCHAR(20) NOT NULL,

    otp_code         VARCHAR(10) NOT NULL,
    purpose          ENUM('registration', 'login', 'password_reset') NOT NULL,

    attempt_count    TINYINT DEFAULT 0,         -- brute force protection (max 3–5)
    is_used          BOOLEAN DEFAULT FALSE,
    expires_at       TIMESTAMP NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast OTP lookup
CREATE INDEX idx_otp_number  ON otp_verifications (recipient_number);
CREATE INDEX idx_otp_expires ON otp_verifications (expires_at);
