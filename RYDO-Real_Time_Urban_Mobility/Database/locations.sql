USE rydo_db;

CREATE TABLE driver_locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id   INT NOT NULL,
    booking_id  INT,
    latitude    DECIMAL(9, 6) NOT NULL,
    longitude   DECIMAL(9, 6) NOT NULL,
    speed       DECIMAL(5, 2) DEFAULT 0.00,
    bearing     DECIMAL(5, 2) DEFAULT 0.00,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id)  REFERENCES drivers  (driver_id)  ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings (booking_id) ON DELETE SET NULL
);
