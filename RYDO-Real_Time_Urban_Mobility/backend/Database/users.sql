CREATE TABLE users (
    user_id            SERIAL PRIMARY KEY,
    user_name          VARCHAR(100) NOT NULL,
    user_number        VARCHAR(20) UNIQUE NOT NULL,
    user_email         VARCHAR(100) UNIQUE,
    user_password_hash VARCHAR(255) NOT NULL,
    user_address       TEXT,
    profile_photo_url  TEXT,
    is_active          BOOLEAN DEFAULT TRUE,
    is_verified        BOOLEAN DEFAULT FALSE,
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- NOTE: your User.js Sequelize model has `timestamps: false`,
-- but this table (and your original MySQL version) has
-- created_at/updated_at columns. That's harmless — Sequelize
-- just won't manage those two columns — but flagging it in
-- case it was meant to be timestamps: true.