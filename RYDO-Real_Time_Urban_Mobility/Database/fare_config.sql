USE rydo_db;

CREATE TABLE fare_config (
    fare_config_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_type   ENUM('Taxi', 'Car', 'Bus') NOT NULL UNIQUE,
    base_fare      DECIMAL(10, 2) NOT NULL,
    per_km_rate    DECIMAL(10, 2) NOT NULL,
    per_min_rate   DECIMAL(10, 2) DEFAULT 0.00,
    minimum_fare   DECIMAL(10, 2) NOT NULL,
    is_active      BOOLEAN DEFAULT TRUE,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE surge_pricing (
    surge_id         INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_type     ENUM('Taxi', 'Car', 'Bus') NOT NULL,
    surge_multiplier DECIMAL(4, 2) NOT NULL,
    reason           VARCHAR(150),
    start_time       TIME,
    end_time         TIME,
    start_date       DATE,
    end_date         DATE,
    is_active        BOOLEAN DEFAULT TRUE,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
