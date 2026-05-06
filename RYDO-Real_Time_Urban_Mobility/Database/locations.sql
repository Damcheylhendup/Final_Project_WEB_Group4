-- ============================================================
-- LOCATIONS (REAL-TIME DRIVER GPS TRACKING)
-- ============================================================
CREATE TABLE driver_locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id   INT NOT NULL,
    booking_id  INT,                        -- link to active booking if on a trip

    latitude    DECIMAL(9, 6) NOT NULL,
    longitude   DECIMAL(9, 6) NOT NULL,
    speed       DECIMAL(5, 2) DEFAULT 0.00, -- km/h
    bearing     DECIMAL(5, 2) DEFAULT 0.00, -- direction in degrees (0–360)

    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (driver_id)  REFERENCES drivers  (driver_id)  ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings (booking_id) ON DELETE SET NULL
);

-- Index for fast real-time queries
CREATE INDEX idx_locations_driver_id  ON driver_locations (driver_id);
CREATE INDEX idx_locations_recorded_at ON driver_locations (recorded_at);
