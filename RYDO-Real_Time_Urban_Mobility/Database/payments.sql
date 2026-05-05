-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,

    payment_method ENUM('cash', 'card', 'mobile_money', 'wallet') NOT NULL,
    payment_status ENUM(
        'pending', 'completed', 'failed', 'refunded'
    ) DEFAULT 'pending',

    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    extra_charge DECIMAL(10, 2) DEFAULT 0,

    transaction_id VARCHAR(255) UNIQUE,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id) REFERENCES bookings (booking_id) ON DELETE CASCADE
);
