-- =====================================================
-- 1. RIDER DRIVER PAYMENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS rider_driver_payments (
    payment_id SERIAL PRIMARY KEY,

    booking_id INTEGER NOT NULL REFERENCES bookings (booking_id) ON DELETE CASCADE,
    rider_id   INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    driver_id  INTEGER NOT NULL REFERENCES drivers (driver_id) ON DELETE CASCADE,

    payment_method VARCHAR(20) NOT NULL
                   CHECK (payment_method IN ('cash', 'card', 'mobile_money', 'wallet')),

    payment_status VARCHAR(20) DEFAULT 'pending'
                   CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded', 'disputed')),

    amount       DECIMAL(10, 2) NOT NULL,
    tip_amount   DECIMAL(10, 2) DEFAULT 0.00,
    extra_charge DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,

    transaction_id     VARCHAR(255) UNIQUE,
    payment_method_ref VARCHAR(255),

    payment_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completion_date TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    notes TEXT
);

CREATE TRIGGER trg_rider_driver_payments_updated_at
BEFORE UPDATE ON rider_driver_payments
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- =====================================================
-- 2. DRIVER EARNINGS
-- =====================================================

CREATE TABLE IF NOT EXISTS driver_earnings (
    earnings_id SERIAL PRIMARY KEY,

    driver_id INTEGER NOT NULL UNIQUE REFERENCES drivers (driver_id) ON DELETE CASCADE,

    total_earnings    DECIMAL(15, 2) DEFAULT 0.00,
    completed_rides   INTEGER DEFAULT 0,
    pending_payments  DECIMAL(15, 2) DEFAULT 0.00,
    tips_received     DECIMAL(15, 2) DEFAULT 0.00,
    cancelled_earnings DECIMAL(15, 2) DEFAULT 0.00,
    withdrawal_total  DECIMAL(15, 2) DEFAULT 0.00,
    current_balance   DECIMAL(15, 2) DEFAULT 0.00,

    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_driver_earnings_last_updated
BEFORE UPDATE ON driver_earnings
FOR EACH ROW
EXECUTE FUNCTION set_last_updated();

-- =====================================================
-- 3. DRIVER WITHDRAWALS
-- =====================================================

CREATE TABLE IF NOT EXISTS driver_withdrawals (
    withdrawal_id SERIAL PRIMARY KEY,

    driver_id INTEGER NOT NULL REFERENCES drivers (driver_id) ON DELETE CASCADE,

    amount DECIMAL(15, 2) NOT NULL,

    withdrawal_method VARCHAR(20) NOT NULL
                      CHECK (withdrawal_method IN ('bank_transfer', 'mobile_money', 'cash')),

    status VARCHAR(20) DEFAULT 'pending'
           CHECK (status IN ('pending', 'processing', 'completed', 'failed')),

    bank_account    VARCHAR(255),
    transaction_ref VARCHAR(255) UNIQUE,

    requested_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_date TIMESTAMP NULL,

    notes TEXT
);

-- =====================================================
-- 4. PAYMENT HISTORY
-- =====================================================

CREATE TABLE IF NOT EXISTS rider_payment_history (
    history_id SERIAL PRIMARY KEY,

    payment_id INTEGER NOT NULL REFERENCES rider_driver_payments (payment_id) ON DELETE CASCADE,
    rider_id   INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    driver_id  INTEGER NOT NULL REFERENCES drivers (driver_id) ON DELETE CASCADE,

    amount DECIMAL(10, 2) NOT NULL,

    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    status         VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INITIALIZE DRIVER EARNINGS
-- MySQL's INSERT IGNORE -> Postgres ON CONFLICT DO NOTHING
-- =====================================================

INSERT INTO driver_earnings (driver_id)
SELECT driver_id FROM drivers
ON CONFLICT (driver_id) DO NOTHING;

-- =====================================================
-- PAYMENT COMPLETION TRIGGER
--
-- NOTE: the original MySQL trigger also wrote
-- total_earnings / total_tips / pending_balance directly
-- onto the `drivers` table. Those columns don't exist in
-- drivers.sql, and driver_earnings already tracks the same
-- numbers, so this version only updates driver_earnings to
-- avoid keeping duplicate, possibly-conflicting totals in
-- two tables. Say the word if you'd rather have a quick-
-- access copy on drivers and I'll add it back in.
-- =====================================================

CREATE OR REPLACE FUNCTION after_payment_completed()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_status = 'completed' AND OLD.payment_status <> 'completed' THEN

        INSERT INTO driver_earnings (driver_id)
        VALUES (NEW.driver_id)
        ON CONFLICT (driver_id) DO NOTHING;

        UPDATE driver_earnings
        SET
            total_earnings  = total_earnings + NEW.amount,
            tips_received   = tips_received + NEW.tip_amount,
            current_balance = current_balance + NEW.total_amount,
            completed_rides = completed_rides + 1,
            last_updated    = NOW()
        WHERE driver_id = NEW.driver_id;

        INSERT INTO rider_payment_history (
            payment_id, rider_id, driver_id, amount,
            payment_method, transaction_id, status
        )
        VALUES (
            NEW.payment_id, NEW.rider_id, NEW.driver_id, NEW.total_amount,
            NEW.payment_method, NEW.transaction_id, 'completed'
        );

    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_after_payment_completed ON rider_driver_payments;

CREATE TRIGGER trg_after_payment_completed
AFTER UPDATE ON rider_driver_payments
FOR EACH ROW
EXECUTE FUNCTION after_payment_completed();

-- =====================================================
-- PROCESS PAYMENT
-- MySQL: CALL ProcessRiderPayment(...)
-- Postgres: SELECT process_rider_payment(...);
-- =====================================================

CREATE OR REPLACE FUNCTION process_rider_payment(
    p_booking_id     INTEGER,
    p_rider_id       INTEGER,
    p_driver_id      INTEGER,
    p_amount         DECIMAL(10, 2),
    p_tip_amount     DECIMAL(10, 2),
    p_payment_method VARCHAR(20),
    p_transaction_id VARCHAR(255)
)
RETURNS TEXT AS $$
BEGIN
    INSERT INTO rider_driver_payments (
        booking_id, rider_id, driver_id,
        payment_method, amount, tip_amount, total_amount,
        transaction_id, payment_status
    )
    VALUES (
        p_booking_id, p_rider_id, p_driver_id,
        p_payment_method, p_amount, p_tip_amount, p_amount + p_tip_amount,
        p_transaction_id, 'completed'
    );

    RETURN 'Payment processed successfully';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- DRIVER DASHBOARD
-- MySQL: CALL GetDriverDashboard(1)
-- Postgres: SELECT * FROM get_driver_dashboard(1);
--
-- NOTE: the original procedure selected d.rating and
-- d.total_ratings, but drivers only has avg_rating (no
-- total_ratings column exists anywhere). Swapped to
-- avg_rating and dropped total_ratings.
-- =====================================================

CREATE OR REPLACE FUNCTION get_driver_dashboard(p_driver_id INTEGER)
RETURNS TABLE (
    driver_id         INTEGER,
    driver_name       VARCHAR,
    driver_email      VARCHAR,
    avg_rating        DECIMAL,
    total_earnings    DECIMAL,
    tips_received     DECIMAL,
    current_balance   DECIMAL,
    completed_rides   INTEGER,
    pending_payments  DECIMAL,
    withdrawal_total  DECIMAL,
    available_balance DECIMAL,
    last_updated      TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        d.driver_id,
        d.driver_name,
        d.driver_email,
        d.avg_rating,
        COALESCE(de.total_earnings, 0),
        COALESCE(de.tips_received, 0),
        COALESCE(de.current_balance, 0),
        COALESCE(de.completed_rides, 0),
        COALESCE(de.pending_payments, 0),
        COALESCE(de.withdrawal_total, 0),
        (COALESCE(de.total_earnings, 0) - COALESCE(de.withdrawal_total, 0)),
        de.last_updated
    FROM drivers d
    LEFT JOIN driver_earnings de ON d.driver_id = de.driver_id
    WHERE d.driver_id = p_driver_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- DRIVER PAYMENT HISTORY
-- MySQL: CALL GetDriverPaymentHistory(1, 20)
-- Postgres: SELECT * FROM get_driver_payment_history(1, 20);
-- =====================================================

CREATE OR REPLACE FUNCTION get_driver_payment_history(
    p_driver_id INTEGER,
    p_limit     INTEGER
)
RETURNS TABLE (
    payment_id      INTEGER,
    booking_id      INTEGER,
    user_name       VARCHAR,
    amount          DECIMAL,
    tip_amount      DECIMAL,
    total_amount    DECIMAL,
    payment_method  VARCHAR,
    payment_status  VARCHAR,
    payment_date    TIMESTAMP,
    completion_date TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
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
    LEFT JOIN users u ON rdp.rider_id = u.user_id
    WHERE rdp.driver_id = p_driver_id
    ORDER BY rdp.payment_date DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- WITHDRAWAL REQUEST
-- MySQL: CALL RequestWithdrawal(1, 500, 'bank_transfer', '123')
-- Postgres: SELECT request_withdrawal(1, 500, 'bank_transfer', '123');
-- =====================================================

CREATE OR REPLACE FUNCTION request_withdrawal(
    p_driver_id         INTEGER,
    p_amount            DECIMAL(15, 2),
    p_withdrawal_method VARCHAR(20),
    p_bank_account      VARCHAR(255)
)
RETURNS TEXT AS $$
DECLARE
    available_balance DECIMAL(15, 2);
BEGIN
    SELECT (total_earnings - withdrawal_total)
    INTO available_balance
    FROM driver_earnings
    WHERE driver_id = p_driver_id;

    IF available_balance IS NULL OR available_balance < p_amount THEN
        RETURN 'Insufficient balance';
    END IF;

    INSERT INTO driver_withdrawals (
        driver_id, amount, withdrawal_method, bank_account, status
    )
    VALUES (
        p_driver_id, p_amount, p_withdrawal_method, p_bank_account, 'pending'
    );

    RETURN 'Withdrawal request submitted';
END;
$$ LANGUAGE plpgsql;