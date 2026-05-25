USE rydo_db;

CREATE TABLE payments (
    payment_id     INT AUTO_INCREMENT PRIMARY KEY,
    booking_id     INT NOT NULL,
    user_id        INT NOT NULL,
    driver_id      INT,
    payment_method ENUM('cash', 'card', 'mobile_money', 'wallet') NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    amount         DECIMAL(10, 2) NOT NULL,
    extra_charge   DECIMAL(10, 2) DEFAULT 0.00,
    transaction_id VARCHAR(255) UNIQUE,
    payment_date   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings (booking_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)    REFERENCES users    (user_id)    ON DELETE CASCADE,
    FOREIGN KEY (driver_id)  REFERENCES drivers  (driver_id)  ON DELETE SET NULL
);

ALTER TABLE bookings 
ADD COLUMN payment_status ENUM('unpaid', 'pending_verification', 'verified', 'rejected') DEFAULT 'unpaid',
ADD COLUMN payment_reference VARCHAR(255),
ADD COLUMN payment_screenshot TEXT,
ADD COLUMN driver_name VARCHAR(255);