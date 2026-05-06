-- ============================================================
-- FARE CONFIG (BASE PRICING PER VEHICLE TYPE)
-- ============================================================
CREATE TABLE fare_config (
    fare_config_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_type   ENUM('sedan', 'suv', 'bike', 'tuktuk', 'van') NOT NULL UNIQUE,

    base_fare      DECIMAL(10, 2) NOT NULL CHECK (base_fare >= 0),       -- flat starting fare
    per_km_rate    DECIMAL(10, 2) NOT NULL CHECK (per_km_rate >= 0),     -- price per km
    per_min_rate   DECIMAL(10, 2) DEFAULT 0.00,                          -- price per min (traffic)
    minimum_fare   DECIMAL(10, 2) NOT NULL CHECK (minimum_fare >= 0),    -- minimum chargeable fare

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- SURGE PRICING (TIME / DEMAND / DATE BASED)
-- ============================================================
CREATE TABLE surge_pricing (
    surge_id          INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_type      ENUM('sedan', 'suv', 'bike', 'tuktuk', 'van'),  -- NULL = applies to all

    surge_multiplier  DECIMAL(4, 2) NOT NULL CHECK (surge_multiplier >= 1.0), -- e.g. 1.5 = 50% extra
    reason            VARCHAR(150),                                    -- e.g. "Peak hours", "Rain"

    -- Daily time window
    start_time        TIME,
    end_time          TIME,

    -- Optional date range (e.g. holidays)
    start_date        DATE,
    end_date          DATE,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
