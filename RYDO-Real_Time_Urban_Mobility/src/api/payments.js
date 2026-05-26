// File: api/payments.js

const express = require("express");
const router = express.Router();

const Database = require("../config/database");
const PaymentController = require("../controllers/PaymentController");

const database = new Database();
const paymentController = new PaymentController(database);

// Process Payment
router.post("/process_payment", async (req, res) => {
    try {
        const result = await paymentController.processRiderPayment(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Driver Dashboard
router.get("/dashboard", async (req, res) => {
    try {
        const { driver_id } = req.query;

        if (!driver_id) {
            return res.status(400).json({
                success: false,
                message: "driver_id is required"
            });
        }

        const dashboard = await paymentController.getDriverDashboard(driver_id);

        res.json({
            success: true,
            data: dashboard
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Payment History
router.get("/history", async (req, res) => {
    try {
        const { driver_id, limit = 20, offset = 0 } = req.query;

        if (!driver_id) {
            return res.status(400).json({
                success: false,
                message: "driver_id is required"
            });
        }

        const history = await paymentController.getPaymentHistory(
            driver_id,
            limit,
            offset
        );

        res.json({
            success: true,
            data: history
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Withdrawal Request
router.post("/withdraw", async (req, res) => {
    try {
        const { driver_id, amount, method, bank_account } = req.body;

        const result = await paymentController.requestWithdrawal(
            driver_id,
            amount,
            method,
            bank_account || null
        );

        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Earnings By Method
router.get("/earnings_by_method", async (req, res) => {
    try {
        const { driver_id } = req.query;

        if (!driver_id) {
            return res.status(400).json({
                success: false,
                message: "driver_id is required"
            });
        }

        const stats = await paymentController.getEarningsByMethod(driver_id);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Daily Earnings
router.get("/daily_earnings", async (req, res) => {
    try {
        const { driver_id, days = 30 } = req.query;

        if (!driver_id) {
            return res.status(400).json({
                success: false,
                message: "driver_id is required"
            });
        }

        const earnings = await paymentController.getDailyEarnings(
            driver_id,
            days
        );

        res.json({
            success: true,
            data: earnings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Invalid Route
router.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Invalid action"
    });
});

module.exports = router;