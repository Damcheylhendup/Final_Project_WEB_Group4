CREATE TABLE otp_verifications (
    otp_id           SERIAL PRIMARY KEY,
    recipient_type   VARCHAR(10) NOT NULL
                     CHECK (recipient_type IN ('user', 'driver', 'admin')),
    recipient_number VARCHAR(20) NOT NULL,
    otp_code         VARCHAR(10) NOT NULL,
    purpose          VARCHAR(20) NOT NULL
                     CHECK (purpose IN ('registration', 'login', 'password_reset')),
    attempt_count    SMALLINT DEFAULT 0,
    is_used          BOOLEAN DEFAULT FALSE,
    expires_at       TIMESTAMP NOT NULL,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NOTE: MySQL's TINYINT doesn't exist in Postgres, converted
-- attempt_count to SMALLINT.