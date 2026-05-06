-- ============================================================
-- NOTIFICATIONS (PUSH / SMS / EMAIL / IN-APP ALERTS)
-- ============================================================
CREATE TABLE notifications (
    notification_id   INT AUTO_INCREMENT PRIMARY KEY,

    -- Who receives the notification
    recipient_type    ENUM('user', 'driver', 'admin') NOT NULL,
    recipient_id      INT NOT NULL,

    -- Notification content
    title             VARCHAR(150) NOT NULL,
    message           TEXT         NOT NULL,
    notification_type ENUM(
        'booking_confirmed',
        'driver_assigned',
        'driver_arrived',
        'trip_started',
        'trip_completed',
        'payment_received',
        'booking_cancelled',
        'otp',
        'general'
    ) NOT NULL,

    -- Optional link to booking
    booking_id INT,

    -- Delivery
    channel    ENUM('push', 'sms', 'email', 'in_app') DEFAULT 'in_app',
    is_sent    BOOLEAN DEFAULT FALSE,   -- whether delivery was attempted
    is_read    BOOLEAN DEFAULT FALSE,   -- whether recipient opened it
    sent_at    TIMESTAMP NULL DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id) REFERENCES bookings (booking_id) ON DELETE SET NULL
);

-- Index for fast unread notification queries
CREATE INDEX idx_notifications_recipient ON notifications (recipient_type, recipient_id);
CREATE INDEX idx_notifications_is_read   ON notifications (is_read);
