USE rydo_db;

CREATE TABLE vehicles (
    vehicle_id          INT AUTO_INCREMENT PRIMARY KEY,
    driver_id           INT NOT NULL,
    vehicle_number      VARCHAR(50) UNIQUE NOT NULL,
    vehicle_type        ENUM('sedan', 'suv', 'bike', 'tuktuk', 'van') NOT NULL,
    vehicle_make        VARCHAR(100),
    vehicle_model       VARCHAR(100),
    vehicle_year        YEAR,
    vehicle_color       VARCHAR(50),
    insurance_number    VARCHAR(100),
    insurance_expiry    DATE,
    registration_expiry DATE,
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers (driver_id) ON DELETE CASCADE
);
