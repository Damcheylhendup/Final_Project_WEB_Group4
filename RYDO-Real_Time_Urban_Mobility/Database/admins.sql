-- ============================================================
-- ADMINS (FOR MANAGING THE SYSTEM)
-- ============================================================
CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_name VARCHAR(100) NOT NULL,
    admin_number VARCHAR(20),
    admin_email VARCHAR(100) UNIQUE NOT NULL,
    admin_password_hash VARCHAR(255) NOT NULL,
    admin_role ENUM('super_admin', 'admin', 'support') DEFAULT 'admin',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
