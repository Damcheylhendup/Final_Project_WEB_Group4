const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define('Payment', {
    payment_id:     { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    booking_id:     { type: DataTypes.INTEGER, allowNull: false },
    user_id:        { type: DataTypes.INTEGER, allowNull: false },
    driver_id:      { type: DataTypes.INTEGER },
    payment_method: { type: DataTypes.ENUM('cash', 'card', 'mobile_money', 'wallet'), allowNull: false },
    payment_status: { type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'), defaultValue: 'pending' },
    amount:         { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    extra_charge:   { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
    transaction_id: { type: DataTypes.STRING, unique: true },
    payment_date:   { type: DataTypes.DATE },
}, { tableName: 'payments', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = Payment;