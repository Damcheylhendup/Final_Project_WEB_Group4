CREATE TABLE fare_config (
    fare_config_id SERIAL PRIMARY KEY,
    vehicle_type   VARCHAR(20) NOT NULL UNIQUE
                   CHECK (vehicle_type IN ('Taxi', 'Car', 'Bus')),
    base_fare      DECIMAL(10, 2) NOT NULL,
    per_km_rate    DECIMAL(10, 2) NOT NULL,
    per_min_rate   DECIMAL(10, 2) DEFAULT 0.00,
    minimum_fare   DECIMAL(10, 2) NOT NULL,
    is_active      BOOLEAN DEFAULT TRUE,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_fare_config_updated_at
BEFORE UPDATE ON fare_config
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE surge_pricing (
    surge_id         SERIAL PRIMARY KEY,
    vehicle_type     VARCHAR(20) NOT NULL
                     CHECK (vehicle_type IN ('Taxi', 'Car', 'Bus')),
    surge_multiplier DECIMAL(4, 2) NOT NULL,
    reason           VARCHAR(150),
    start_time       TIME,
    end_time         TIME,
    start_date       DATE,
    end_date         DATE,
    is_active        BOOLEAN DEFAULT TRUE,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_surge_pricing_updated_at
BEFORE UPDATE ON surge_pricing
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();