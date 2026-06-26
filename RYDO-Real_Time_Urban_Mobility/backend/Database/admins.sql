CREATE TABLE drivers (
    driver_id             SERIAL PRIMARY KEY,
    driver_name           VARCHAR(100) NOT NULL,
    driver_number         VARCHAR(20) UNIQUE NOT NULL,
    driver_email          VARCHAR(100) UNIQUE,
    driver_password_hash  VARCHAR(255) NOT NULL,
    license_number        VARCHAR(50) UNIQUE,
    driver_photo_url      TEXT,
    is_verified           BOOLEAN DEFAULT FALSE,
    driver_status         VARCHAR(20) DEFAULT 'active'
                          CHECK (driver_status IN ('active', 'inactive', 'suspended')),
    avg_rating            DECIMAL(3, 2) DEFAULT 0.00,
    is_available          BOOLEAN DEFAULT TRUE,
    current_latitude      DECIMAL(9, 6),
    current_longitude     DECIMAL(9, 6),
    last_location_updated TIMESTAMP NULL DEFAULT NULL,
    payment_name          VARCHAR(100),
    payment_number        VARCHAR(50),
    qr_code_url           TEXT,
    created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_drivers_updated_at
BEFORE UPDATE ON drivers
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- NOTE: vehicle_type / vehicle_number were removed from this table.
-- They now live only in `vehicles` (keyed on driver_id), so a
-- driver's current vehicle is looked up via a join instead of
-- being duplicated here, e.g.:
--
-- SELECT d.*, v.vehicle_type, v.vehicle_number
-- FROM drivers d
-- LEFT JOIN vehicles v ON v.driver_id = d.driver_id AND v.is_active = TRUE
-- WHERE d.driver_id = $1;