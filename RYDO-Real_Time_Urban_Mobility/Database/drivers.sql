-- ============================================================
-- DRIVERS
-- ============================================================
CREATE TABLE drivers (
    driver_id          INT AUTO_INCREMENT PRIMARY KEY,
    driver_name        VARCHAR(100) NOT NULL,
    driver_number      VARCHAR(20)  UNIQUE NOT NULL,
    driver_email       VARCHAR(100) UNIQUE,
    driver_password_hash VARCHAR(255) NOT NULL,

    -- License & verification
    license_number     VARCHAR(50)  UNIQUE,
    driver_photo_url   TEXT,
    is_verified        BOOLEAN DEFAULT FALSE,  -- verified by admin

    -- Status & rating
    driver_status      ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    avg_rating         DECIMAL(3, 2) DEFAULT 0.00 CHECK (avg_rating BETWEEN 0 AND 5),

    -- Availability & real-time location (quick-access snapshot)
    is_available       BOOLEAN DEFAULT TRUE,
    current_latitude   DECIMAL(9, 6),
    current_longitude  DECIMAL(9, 6),
    last_location_updated TIMESTAMP NULL DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
