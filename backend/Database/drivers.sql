USE rydo_db;

CREATE TABLE drivers (
    driver_id             INT AUTO_INCREMENT PRIMARY KEY,
    driver_name           VARCHAR(100) NOT NULL,
    driver_number         VARCHAR(20) UNIQUE NOT NULL,
    driver_email          VARCHAR(100) UNIQUE,
    driver_password_hash  VARCHAR(255) NOT NULL,
    license_number        VARCHAR(50) UNIQUE,
    driver_photo_url      TEXT,
    is_verified           BOOLEAN DEFAULT FALSE,
    driver_status         ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    avg_rating            DECIMAL(3, 2) DEFAULT 0.00,
    is_available          BOOLEAN DEFAULT TRUE,
    current_latitude      DECIMAL(9, 6),
    current_longitude     DECIMAL(9, 6),
    last_location_updated TIMESTAMP NULL DEFAULT NULL,
    created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE drivers
ADD COLUMN payment_name VARCHAR(100) NULL,
ADD COLUMN payment_number VARCHAR(50) NULL,
ADD COLUMN qr_code_url TEXT NULL;