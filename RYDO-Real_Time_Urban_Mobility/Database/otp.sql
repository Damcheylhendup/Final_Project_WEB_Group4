USE rydo_db;

CREATE TABLE otp_verifications (
    otp_id           INT AUTO_INCREMENT PRIMARY KEY,
    recipient_type   ENUM('user', 'driver', 'admin') NOT NULL,
    recipient_number VARCHAR(20) NOT NULL,
    otp_code         VARCHAR(10) NOT NULL,
    purpose          ENUM('registration', 'login', 'password_reset') NOT NULL,
    attempt_count    TINYINT DEFAULT 0,
    is_used          BOOLEAN DEFAULT FALSE,
    expires_at       TIMESTAMP NOT NULL,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
