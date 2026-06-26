// File: PaymentController.js

class PaymentController {
    constructor(database) {
        this.db = database;
        this.conn = database.connect();
    }

    /**
     * Process payment from rider to driver
     */
    async processRiderPayment(data) {
        try {
            const {
                booking_id,
                rider_id,
                driver_id,
                amount,
                payment_method,
                tip_amount = 0
            } = data;

            // Validate input
            if (
                !booking_id ||
                !rider_id ||
                !driver_id ||
                !amount ||
                !payment_method
            ) {
                return {
                    success: false,
                    message: "Missing required fields"
                };
            }

            const transaction_id = `TXN_${Date.now()}`;

            // Verify rider exists
            const [riderCheck] = await this.conn.query(
                "SELECT user_id FROM users WHERE user_id = ?",
                [rider_id]
            );

            if (riderCheck.length === 0) {
                return {
                    success: false,
                    message: "Rider not found"
                };
            }

            // Verify driver exists
            const [driverCheck] = await this.conn.query(
                "SELECT driver_id FROM drivers WHERE driver_id = ?",
                [driver_id]
            );

            if (driverCheck.length === 0) {
                return {
                    success: false,
                    message: "Driver not found"
                };
            }

            // Calculate total
            const total_amount = Number(amount) + Number(tip_amount);

            // Insert payment record
            const query = `
                INSERT INTO rider_driver_payments
                (
                    booking_id,
                    rider_id,
                    driver_id,
                    payment_method,
                    amount,
                    tip_amount,
                    total_amount,
                    transaction_id,
                    payment_status,
                    payment_date
                )
                VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, 'completed', NOW())
            `;

            const [result] = await this.conn.query(query, [
                booking_id,
                rider_id,
                driver_id,
                payment_method,
                amount,
                tip_amount,
                total_amount,
                transaction_id
            ]);

            return {
                success: true,
                message: "Payment processed successfully",
                transaction_id,
                payment_id: result.insertId
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Get driver dashboard data
     */
    async getDriverDashboard(driver_id) {
        try {
            const query = `
                SELECT
                    d.driver_id,
                    d.first_name,
                    d.last_name,
                    d.email,
                    d.phone,
                    de.total_earnings,
                    de.tips_received,
                    de.current_balance,
                    de.completed_rides,
                    de.pending_payments,
                    (de.total_earnings - de.withdrawal_total) AS available_balance,
                    d.rating,

                    (
                        SELECT COUNT(*)
                        FROM rider_driver_payments
                        WHERE driver_id = ?
                        AND payment_status = 'pending'
                    ) AS pending_count,

                    (
                        SELECT COUNT(*)
                        FROM rider_driver_payments
                        WHERE driver_id = ?
                        AND payment_status = 'completed'
                        AND DATE(payment_date) = CURDATE()
                    ) AS todays_rides

                FROM drivers d
                LEFT JOIN driver_earnings de
                ON d.driver_id = de.driver_id

                WHERE d.driver_id = ?
            `;

            const [result] = await this.conn.query(query, [
                driver_id,
                driver_id,
                driver_id
            ]);

            return result.length > 0 ? result[0] : null;

        } catch (error) {
            console.error(error);
            return null;
        }
    }

    /**
     * Get driver payment history
     */
    async getPaymentHistory(driver_id, limit = 20, offset = 0) {
        try {
            const query = `
                SELECT
                    rdp.payment_id,
                    rdp.booking_id,
                    u.first_name AS rider_name,
                    u.email AS rider_email,
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

                WHERE rdp.driver_id = ?

                ORDER BY rdp.payment_date DESC
                LIMIT ? OFFSET ?
            `;

            const [history] = await this.conn.query(query, [
                driver_id,
                Number(limit),
                Number(offset)
            ]);

            return history;

        } catch (error) {
            console.error(error);
            return [];
        }
    }

    /**
     * Request withdrawal
     */
    async requestWithdrawal(driver_id, amount, method, bank_account = null) {
        try {
            // Check available balance
            const balanceQuery = `
                SELECT
                    (total_earnings - withdrawal_total) AS available
                FROM driver_earnings
                WHERE driver_id = ?
            `;

            const [balanceResult] = await this.conn.query(balanceQuery, [
                driver_id
            ]);

            const available = balanceResult[0]?.available || 0;

            if (available < amount) {
                return {
                    success: false,
                    message: `Insufficient balance. Available: ${available}`
                };
            }

            // Insert withdrawal request
            const query = `
                INSERT INTO driver_withdrawals
                (
                    driver_id,
                    amount,
                    withdrawal_method,
                    bank_account,
                    status
                )
                VALUES
                (?, ?, ?, ?, 'pending')
            `;

            const [result] = await this.conn.query(query, [
                driver_id,
                amount,
                method,
                bank_account
            ]);

            return {
                success: true,
                message: "Withdrawal request submitted",
                withdrawal_id: result.insertId
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Get earning statistics by payment method
     */
    async getEarningsByMethod(driver_id) {
        try {
            const query = `
                SELECT
                    payment_method,
                    COUNT(*) AS total_payments,
                    SUM(amount) AS total_amount,
                    SUM(tip_amount) AS total_tips

                FROM rider_driver_payments

                WHERE driver_id = ?
                AND payment_status = 'completed'

                GROUP BY payment_method
            `;

            const [stats] = await this.conn.query(query, [driver_id]);

            return stats;

        } catch (error) {
            console.error(error);
            return [];
        }
    }

    /**
     * Get daily earnings
     */
    async getDailyEarnings(driver_id, days = 30) {
        try {
            const query = `
                SELECT
                    DATE(payment_date) AS earning_date,
                    COUNT(*) AS rides,
                    SUM(amount) AS total_earnings,
                    SUM(tip_amount) AS tips,
                    SUM(total_amount) AS total_amount

                FROM rider_driver_payments

                WHERE driver_id = ?
                AND payment_status = 'completed'
                AND payment_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)

                GROUP BY DATE(payment_date)

                ORDER BY earning_date DESC
            `;

            const [earnings] = await this.conn.query(query, [
                driver_id,
                days
            ]);

            return earnings;

        } catch (error) {
            console.error(error);
            return [];
        }
    }
}

module.exports = PaymentController;