CREATE TABLE vehicles (
    vehicle_id          SERIAL PRIMARY KEY,
    driver_id           INTEGER NOT NULL REFERENCES drivers (driver_id) ON DELETE CASCADE,
    vehicle_number      VARCHAR(50) UNIQUE NOT NULL,
    vehicle_type        VARCHAR(20) NOT NULL
                        CHECK (vehicle_type IN ('Car', 'Taxi', 'Bus')),
    vehicle_make        VARCHAR(100),
    vehicle_model       VARCHAR(100),
    vehicle_year        SMALLINT,
    vehicle_color       VARCHAR(50),
    insurance_number    VARCHAR(100),
    insurance_expiry    DATE,
    registration_expiry DATE,
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_vehicles_updated_at
BEFORE UPDATE ON vehicles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- NOTE: MySQL's YEAR type doesn't exist in Postgres, converted
-- vehicle_year to SMALLINT.