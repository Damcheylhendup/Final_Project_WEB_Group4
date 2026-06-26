CREATE TABLE bookings (
    booking_id             SERIAL PRIMARY KEY,
    user_id                INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    driver_id              INTEGER REFERENCES drivers (driver_id) ON DELETE SET NULL,
    vehicle_type_requested VARCHAR(20) NOT NULL
                           CHECK (vehicle_type_requested IN ('Car', 'Taxi', 'Bus')),
    pickup_address         TEXT NOT NULL,
    pickup_latitude        DECIMAL(9, 6) NOT NULL,
    pickup_longitude       DECIMAL(9, 6) NOT NULL,
    drop_address           TEXT NOT NULL,
    drop_latitude          DECIMAL(9, 6) NOT NULL,
    drop_longitude         DECIMAL(9, 6) NOT NULL,
    distance_km            DECIMAL(8, 2) DEFAULT 0.00,
    booking_date           DATE NOT NULL,
    booking_time           TIME NOT NULL,
    fare                   DECIMAL(10, 2) NOT NULL,
    final_fare             DECIMAL(10, 2),
    booking_status         VARCHAR(20) DEFAULT 'pending'
                           CHECK (booking_status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    cancellation_reason    TEXT,
    payment_status         VARCHAR(25) DEFAULT 'unpaid'
                           CHECK (payment_status IN ('unpaid', 'pending_verification', 'verified', 'rejected')),
    payment_reference      VARCHAR(255),
    payment_screenshot     TEXT,
    driver_name            VARCHAR(255),
    created_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE booking_status_history (
    id           SERIAL PRIMARY KEY,
    booking_id   INTEGER NOT NULL REFERENCES bookings (booking_id) ON DELETE CASCADE,
    status_value VARCHAR(20) NOT NULL
                CHECK (status_value IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    changed_by   VARCHAR(10) DEFAULT 'system'
                CHECK (changed_by IN ('user', 'driver', 'admin', 'system')),
    changed_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NOTE: payment_status / payment_reference / payment_screenshot /
-- driver_name used to be added via a later ALTER TABLE in
-- payments.sql. Merged directly into the CREATE TABLE here so you
-- don't have to run things in a fragile order. Same goes for
-- Booking.js: timestamps: false there, but this table has
-- created_at/updated_at (same situation as users.sql) — not a
-- problem, just noting the mismatch.