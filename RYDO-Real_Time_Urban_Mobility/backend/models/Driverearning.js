const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DriverEarning = sequelize.define('DriverEarning', {
    earnings_id:        { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    driver_id:          { type: DataTypes.INTEGER, allowNull: false, unique: true },
    total_earnings:     { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
    completed_rides:    { type: DataTypes.INTEGER, defaultValue: 0 },
    pending_payments:   { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
    tips_received:      { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
    cancelled_earnings: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
    withdrawal_total:   { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
    current_balance:    { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
}, { tableName: 'driver_earnings', timestamps: true, createdAt: false, updatedAt: 'last_updated' });

module.exports = DriverEarning;