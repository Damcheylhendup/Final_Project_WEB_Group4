CREATE TABLE payments (
    payment_id     SERIAL PRIMARY KEY,
    booking_id     INTEGER NOT NULL REFERENCES bookings (booking_id) ON DELETE CASCADE,
    user_id        INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    driver_id      INTEGER REFERENCES drivers (driver_id) ON DELETE SET NULL,
    payment_method VARCHAR(20) NOT NULL
                   CHECK (payment_method IN ('cash', 'card', 'mobile_money', 'wallet')),
    payment_status VARCHAR(20) DEFAULT 'pending'
                   CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    amount         DECIMAL(10, 2) NOT NULL,
    extra_charge   DECIMAL(10, 2) DEFAULT 0.00,
    transaction_id VARCHAR(255) UNIQUE,
    payment_date   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NOTE: the original payments.sql ended with two ALTER TABLE
-- statements (adding payment_status etc. to bookings, and
-- qr_code_url to drivers). Those are now built directly into
-- bookings.sql and drivers.sql instead, so nothing further to
-- run here.