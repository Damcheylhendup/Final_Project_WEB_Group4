CREATE INDEX idx_users_number ON users(user_number);

CREATE INDEX idx_drivers_number ON drivers(driver_number);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_driver_id ON bookings(driver_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);

CREATE INDEX idx_payments_booking_id ON payments(booking_id);