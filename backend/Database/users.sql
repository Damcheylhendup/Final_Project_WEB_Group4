USE rydo_db;

CREATE TABLE users (
    user_id            INT AUTO_INCREMENT PRIMARY KEY,
    user_name          VARCHAR(100) NOT NULL,
    user_number        VARCHAR(20) UNIQUE NOT NULL,
    user_email         VARCHAR(100) UNIQUE,
    user_password_hash VARCHAR(255) NOT NULL,
    user_address       TEXT,
    profile_photo_url  TEXT,
    is_active          BOOLEAN DEFAULT TRUE,
    is_verified        BOOLEAN DEFAULT FALSE,
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);