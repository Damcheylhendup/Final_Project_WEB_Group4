-- ============================================================
-- BOOKINGS (CORE TABLE)
-- ============================================================
CREATE TABLE bookings (
    booking_id       INT AUTO_INCREMENT PRIMARY KEY,
    user_id          INT NOT NULL,
    driver_id        INT,                  -- nullable: assigned after booking

    -- Vehicle type requested by user
    vehicle_type_requested ENUM('sedan', 'suv', 'bike', 'tuktuk', 'van') NOT NULL,

    -- Pickup location
    pickup_address   TEXT           NOT NULL,
    pickup_latitude  DECIMAL(9, 6)  NOT NULL,
    pickup_longitude DECIMAL(9, 6)  NOT NULL,

    -- Drop location
    drop_address     TEXT           NOT NULL,
    drop_latitude    DECIMAL(9, 6)  NOT NULL,
    drop_longitude   DECIMAL(9, 6)  NOT NULL,

    -- Distance
    distance_km      DECIMAL(8, 2)  DEFAULT 0.00 CHECK (distance_km >= 0),

    booking_date     DATE NOT NULL,
    booking_time     TIME NOT NULL,

    -- Fare: estimated at booking, final after trip
    fare             DECIMAL(10, 2) NOT NULL CHECK (fare >= 0),
    final_fare       DECIMAL(10, 2)           CHECK (final_fare >= 0),

    booking_status   ENUM(
        'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'
    ) DEFAULT 'pending',

    -- Cancellation
    cancellation_reason TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)   REFERENCES users   (user_id)   ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers (driver_id) ON DELETE SET NULL
);

-- ============================================================
-- BOOKING STATUS HISTORY
-- ============================================================
CREATE TABLE booking_status_history (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    booking_id   INT NOT NULL,
    status_value ENUM(
        'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'
    ) NOT NULL,
    changed_by   ENUM('user', 'driver', 'admin', 'system') DEFAULT 'system',
    changed_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id) REFERENCES bookings (booking_id) ON DELETE CASCADE
);
