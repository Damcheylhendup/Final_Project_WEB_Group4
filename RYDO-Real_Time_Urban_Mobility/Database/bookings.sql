-- BOOKINGS (CORE TABLE)
CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    driver_id INT NOT NULL,

    pickup_location TEXT NOT NULL,
    drop_location TEXT NOT NULL,

    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,

    fare DECIMAL(10,2) NOT NULL CHECK (fare >= 0),
    booking_status VARCHAR(50) DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id) ON DELETE SET NULL
);

CREATE TABLE booking_status_history (
    id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL,
    status VARCHAR(50),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);