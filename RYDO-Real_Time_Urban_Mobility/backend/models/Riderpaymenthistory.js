const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RiderPaymentHistory = sequelize.define('RiderPaymentHistory', {
    history_id:     { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    payment_id:     { type: DataTypes.INTEGER, allowNull: false },
    rider_id:       { type: DataTypes.INTEGER, allowNull: false },
    driver_id:      { type: DataTypes.INTEGER, allowNull: false },
    amount:         { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    payment_method: { type: DataTypes.STRING },
    transaction_id: { type: DataTypes.STRING },
    status:         { type: DataTypes.STRING },
}, { tableName: 'rider_payment_history', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = RiderPaymentHistory;