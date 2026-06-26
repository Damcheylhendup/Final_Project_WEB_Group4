const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RiderDriverPayment = sequelize.define('RiderDriverPayment', {
    payment_id:         { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    booking_id:         { type: DataTypes.INTEGER, allowNull: false },
    rider_id:           { type: DataTypes.INTEGER, allowNull: false },
    driver_id:          { type: DataTypes.INTEGER, allowNull: false },
    payment_method:     { type: DataTypes.ENUM('cash', 'card', 'mobile_money', 'wallet'), allowNull: false },
    payment_status:     { type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded', 'disputed'), defaultValue: 'pending' },
    amount:             { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    tip_amount:         { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
    extra_charge:       { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
    total_amount:       { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    transaction_id:     { type: DataTypes.STRING, unique: true },
    payment_method_ref: { type: DataTypes.STRING },
    payment_date:       { type: DataTypes.DATE },
    completion_date:    { type: DataTypes.DATE },
    notes:              { type: DataTypes.TEXT },
}, { tableName: 'rider_driver_payments', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

module.exports = RiderDriverPayment;