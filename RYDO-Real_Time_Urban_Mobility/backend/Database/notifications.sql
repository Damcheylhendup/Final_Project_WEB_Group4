CREATE TABLE notifications (
    notification_id   SERIAL PRIMARY KEY,
    recipient_type    VARCHAR(10) NOT NULL
                      CHECK (recipient_type IN ('user', 'driver', 'admin')),
    recipient_id      INTEGER NOT NULL,
    title             VARCHAR(150) NOT NULL,
    message           TEXT NOT NULL,
    notification_type VARCHAR(30) NOT NULL
                      CHECK (notification_type IN (
                          'booking_confirmed', 'driver_assigned', 'driver_arrived',
                          'trip_started', 'trip_completed', 'payment_received',
                          'booking_cancelled', 'otp', 'general'
                      )),
    booking_id        INTEGER REFERENCES bookings (booking_id) ON DELETE SET NULL,
    channel           VARCHAR(10) DEFAULT 'in_app'
                      CHECK (channel IN ('push', 'sms', 'email', 'in_app')),
    is_sent           BOOLEAN DEFAULT FALSE,
    is_read           BOOLEAN DEFAULT FALSE,
    sent_at           TIMESTAMP NULL DEFAULT NULL,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);