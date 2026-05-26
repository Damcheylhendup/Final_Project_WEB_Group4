USE rydo_db;

-- =====================================================
-- 1. RIDER DRIVER PAYMENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS rider_driver_payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,

    booking_id INT NOT NULL,
    rider_id INT NOT NULL,
    driver_id INT NOT NULL,

    payment_method ENUM(
        'cash',
        'card',
        'mobile_money',
        'wallet'
    ) NOT NULL,

    payment_status ENUM(
        'pending',
        'completed',
        'failed',
        'refunded',
        'disputed'
    ) DEFAULT 'pending',

    amount DECIMAL(10,2) NOT NULL,
    tip_amount DECIMAL(10,2) DEFAULT 0.00,
    extra_charge DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,

    transaction_id VARCHAR(255) UNIQUE,
    payment_method_ref VARCHAR(255),

    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completion_date TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    notes TEXT,

    FOREIGN KEY (booking_id)
        REFERENCES bookings(booking_id)
        ON DELETE CASCADE,

    FOREIGN KEY (rider_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (driver_id)
        REFERENCES drivers(driver_id)
        ON DELETE CASCADE
);

-- =====================================================
-- 2. DRIVER EARNINGS
-- =====================================================

CREATE TABLE IF NOT EXISTS driver_earnings (

    earnings_id INT AUTO_INCREMENT PRIMARY KEY,

    driver_id INT NOT NULL UNIQUE,

    total_earnings DECIMAL(15,2) DEFAULT 0.00,
    completed_rides INT DEFAULT 0,
    pending_payments DECIMAL(15,2) DEFAULT 0.00,
    tips_received DECIMAL(15,2) DEFAULT 0.00,
    cancelled_earnings DECIMAL(15,2) DEFAULT 0.00,
    withdrawal_total DECIMAL(15,2) DEFAULT 0.00,
    current_balance DECIMAL(15,2) DEFAULT 0.00,

    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (driver_id)
        REFERENCES drivers(driver_id)
        ON DELETE CASCADE
);

-- =====================================================
-- 3. DRIVER WITHDRAWALS
-- =====================================================

CREATE TABLE IF NOT EXISTS driver_withdrawals (

    withdrawal_id INT AUTO_INCREMENT PRIMARY KEY,

    driver_id INT NOT NULL,

    amount DECIMAL(15,2) NOT NULL,

    withdrawal_method ENUM(
        'bank_transfer',
        'mobile_money',
        'cash'
    ) NOT NULL,

    status ENUM(
        'pending',
        'processing',
        'completed',
        'failed'
    ) DEFAULT 'pending',

    bank_account VARCHAR(255),
    transaction_ref VARCHAR(255) UNIQUE,

    requested_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_date TIMESTAMP NULL,

    notes TEXT,

    FOREIGN KEY (driver_id)
        REFERENCES drivers(driver_id)
        ON DELETE CASCADE
);

-- =====================================================
-- 4. PAYMENT HISTORY
-- =====================================================

CREATE TABLE IF NOT EXISTS rider_payment_history (

    history_id INT AUTO_INCREMENT PRIMARY KEY,

    payment_id INT NOT NULL,
    rider_id INT NOT NULL,
    driver_id INT NOT NULL,

    amount DECIMAL(10,2) NOT NULL,

    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    status VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (payment_id)
        REFERENCES rider_driver_payments(payment_id)
        ON DELETE CASCADE,

    FOREIGN KEY (rider_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (driver_id)
        REFERENCES drivers(driver_id)
        ON DELETE CASCADE
);

-- =====================================================
-- INITIALIZE DRIVER EARNINGS
-- =====================================================

INSERT IGNORE INTO driver_earnings(driver_id)
SELECT driver_id
FROM drivers;

-- =====================================================
-- REMOVE OLD OBJECTS
-- =====================================================

DROP TRIGGER IF EXISTS after_payment_completed;

DROP PROCEDURE IF EXISTS ProcessRiderPayment;
DROP PROCEDURE IF EXISTS GetDriverDashboard;
DROP PROCEDURE IF EXISTS GetDriverPaymentHistory;
DROP PROCEDURE IF EXISTS RequestWithdrawal;

-- =====================================================
-- PAYMENT COMPLETION TRIGGER
-- =====================================================

DELIMITER $$

CREATE TRIGGER after_payment_completed
AFTER UPDATE ON rider_driver_payments
FOR EACH ROW
BEGIN

    IF NEW.payment_status = 'completed'
       AND OLD.payment_status <> 'completed' THEN

        INSERT IGNORE INTO driver_earnings(driver_id)
        VALUES (NEW.driver_id);

        UPDATE driver_earnings
        SET
            total_earnings = total_earnings + NEW.amount,
            tips_received = tips_received + NEW.tip_amount,
            current_balance = current_balance + NEW.total_amount,
            completed_rides = completed_rides + 1,
            last_updated = CURRENT_TIMESTAMP
        WHERE driver_id = NEW.driver_id;

        UPDATE drivers
        SET
            total_earnings = total_earnings + NEW.amount,
            total_tips = total_tips + NEW.tip_amount,
            pending_balance = pending_balance + NEW.total_amount
        WHERE driver_id = NEW.driver_id;

        INSERT INTO rider_payment_history(
            payment_id,
            rider_id,
            driver_id,
            amount,
            payment_method,
            transaction_id,
            status
        )
        VALUES(
            NEW.payment_id,
            NEW.rider_id,
            NEW.driver_id,
            NEW.total_amount,
            NEW.payment_method,
            NEW.transaction_id,
            'completed'
        );

    END IF;

END$$

DELIMITER ;

-- =====================================================
-- PROCESS PAYMENT
-- =====================================================

DELIMITER $$

CREATE PROCEDURE ProcessRiderPayment(

    IN p_booking_id INT,
    IN p_rider_id INT,
    IN p_driver_id INT,

    IN p_amount DECIMAL(10,2),
    IN p_tip_amount DECIMAL(10,2),

    IN p_payment_method VARCHAR(50),
    IN p_transaction_id VARCHAR(255)

)
BEGIN

    INSERT INTO rider_driver_payments(

        booking_id,
        rider_id,
        driver_id,

        payment_method,

        amount,
        tip_amount,
        total_amount,

        transaction_id,

        payment_status

    )
    VALUES(

        p_booking_id,
        p_rider_id,
        p_driver_id,

        p_payment_method,

        p_amount,
        p_tip_amount,
        p_amount + p_tip_amount,

        p_transaction_id,

        'completed'

    );

    SELECT 'Payment processed successfully' AS message;

END$$

DELIMITER ;

-- =====================================================
-- DRIVER DASHBOARD
-- =====================================================

DELIMITER $$

CREATE PROCEDURE GetDriverDashboard(
    IN p_driver_id INT
)
BEGIN

    SELECT

        d.driver_id,
        d.driver_name,
        d.driver_email,

        d.rating,
        d.total_ratings,

        COALESCE(de.total_earnings,0) total_earnings,
        COALESCE(de.tips_received,0) tips_received,
        COALESCE(de.current_balance,0) current_balance,
        COALESCE(de.completed_rides,0) completed_rides,
        COALESCE(de.pending_payments,0) pending_payments,
        COALESCE(de.withdrawal_total,0) withdrawal_total,

        (
            COALESCE(de.total_earnings,0)
            -
            COALESCE(de.withdrawal_total,0)
        ) AS available_balance,

        de.last_updated

    FROM drivers d

    LEFT JOIN driver_earnings de
        ON d.driver_id = de.driver_id

    WHERE d.driver_id = p_driver_id;

END$$

DELIMITER ;

-- =====================================================
-- DRIVER PAYMENT HISTORY
-- =====================================================

DELIMITER $$

CREATE PROCEDURE GetDriverPaymentHistory(
    IN p_driver_id INT,
    IN p_limit INT
)
BEGIN

    SELECT

        rdp.payment_id,
        rdp.booking_id,

        u.user_name,

        rdp.amount,
        rdp.tip_amount,
        rdp.total_amount,

        rdp.payment_method,
        rdp.payment_status,

        rdp.payment_date,
        rdp.completion_date

    FROM rider_driver_payments rdp

    LEFT JOIN users u
        ON rdp.rider_id = u.user_id

    WHERE rdp.driver_id = p_driver_id

    ORDER BY rdp.payment_date DESC

    LIMIT p_limit;

END$$

DELIMITER ;

-- =====================================================
-- WITHDRAWAL REQUEST
-- =====================================================

DELIMITER $$

CREATE PROCEDURE RequestWithdrawal(

    IN p_driver_id INT,
    IN p_amount DECIMAL(15,2),
    IN p_withdrawal_method VARCHAR(50),
    IN p_bank_account VARCHAR(255)

)
BEGIN

    DECLARE available_balance DECIMAL(15,2);

    SELECT
        (total_earnings - withdrawal_total)
    INTO available_balance
    FROM driver_earnings
    WHERE driver_id = p_driver_id;

    IF available_balance < p_amount THEN

        SELECT
        'Insufficient balance'
        AS error_message;

    ELSE

        INSERT INTO driver_withdrawals(

            driver_id,
            amount,
            withdrawal_method,
            bank_account,
            status

        )
        VALUES(

            p_driver_id,
            p_amount,
            p_withdrawal_method,
            p_bank_account,
            'pending'

        );

        SELECT
        'Withdrawal request submitted'
        AS success_message;

    END IF;

END$$

DELIMITER ;