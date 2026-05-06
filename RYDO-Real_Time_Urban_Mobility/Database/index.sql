-- ============================================================
-- INDEXES
-- ============================================================

-- Users
CREATE INDEX idx_users_number ON users (user_number);

-- Drivers
CREATE INDEX idx_drivers_number ON drivers (driver_number);
-- fast lookup for available drivers
CREATE INDEX idx_drivers_available ON drivers (is_available);

-- Bookings
CREATE INDEX idx_bookings_user_id ON bookings (user_id);
CREATE INDEX idx_bookings_driver_id ON bookings (driver_id);
CREATE INDEX idx_bookings_date ON bookings (booking_date);
-- filter by status quickly
CREATE INDEX idx_bookings_status ON bookings (booking_status);

-- Payments
CREATE INDEX idx_payments_booking_id ON payments (booking_id);
CREATE INDEX idx_payments_status ON payments (payment_status);
