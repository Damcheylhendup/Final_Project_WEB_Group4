const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DriverWithdrawal = sequelize.define('DriverWithdrawal', {
    withdrawal_id:     { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    driver_id:         { type: DataTypes.INTEGER, allowNull: false },
    amount:            { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    withdrawal_method: { type: DataTypes.ENUM('bank_transfer', 'mobile_money', 'cash'), allowNull: false },
    status:            { type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'), defaultValue: 'pending' },
    bank_account:      { type: DataTypes.STRING },
    transaction_ref:   { type: DataTypes.STRING, unique: true },
    requested_date:    { type: DataTypes.DATE },
    completed_date:    { type: DataTypes.DATE },
    notes:             { type: DataTypes.TEXT },
}, { tableName: 'driver_withdrawals', timestamps: false });

module.exports = DriverWithdrawal;