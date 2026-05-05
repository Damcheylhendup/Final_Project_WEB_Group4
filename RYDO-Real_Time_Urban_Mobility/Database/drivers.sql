-- ============================================================
-- DRIVERS
-- ============================================================
CREATE TABLE drivers (
    driver_id INT AUTO_INCREMENT PRIMARY KEY,
    driver_name VARCHAR(100) NOT NULL,
    driver_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_number VARCHAR(50) UNIQUE NOT NULL,
    vehicle_type ENUM('sedan', 'suv', 'bike', 'tuktuk', 'van') NOT NULL,

    -- Availability & real-time location
    is_available BOOLEAN DEFAULT TRUE,
    current_latitude DECIMAL(9, 6),
    current_longitude DECIMAL(9, 6),
    last_location_updated TIMESTAMP NULL DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
