-- NOTE: your original locations.sql only contained a leftover
-- debug command ("DESCRIBE driver_withdrawals;"), not an actual
-- table definition. Based on how index.sql references
-- driver_locations (idx_locations_driver), this rebuilds it as a
-- location-history log, separate from the live
-- current_latitude/current_longitude snapshot already stored
-- directly on the drivers table. If this isn't what you had in
-- mind for this table, let me know and I'll adjust it.

CREATE TABLE driver_locations (
    location_id SERIAL PRIMARY KEY,
    driver_id   INTEGER NOT NULL REFERENCES drivers (driver_id) ON DELETE CASCADE,
    latitude    DECIMAL(9, 6) NOT NULL,
    longitude   DECIMAL(9, 6) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);