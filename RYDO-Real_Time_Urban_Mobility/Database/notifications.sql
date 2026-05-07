USE rydo_db;

CREATE TABLE notifications (
    notification_id   INT AUTO_INCREMENT PRIMARY KEY,
    recipient_type    ENUM('user', 'driver', 'admin') NOT NULL,
    recipient_id      INT NOT NULL,
    title             VARCHAR(150) NOT NULL,
    message           TEXT NOT NULL,
    notification_type ENUM('booking_confirmed', 'driver_assigned', 'driver_arrived', 'trip_started', 'trip_completed', 'payment_received', 'booking_cancelled', 'otp', 'general') NOT NULL,
    booking_id        INT,
    channel           ENUM('push', 'sms', 'email', 'in_app') DEFAULT 'in_app',
    is_sent           BOOLEAN DEFAULT FALSE,
    is_read           BOOLEAN DEFAULT FALSE,
    sent_at           TIMESTAMP NULL DEFAULT NULL,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings (booking_id) ON DELETE SET NULL
);
