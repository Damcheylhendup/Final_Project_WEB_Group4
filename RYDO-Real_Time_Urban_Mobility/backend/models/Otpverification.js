const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OtpVerification = sequelize.define('OtpVerification', {
    otp_id:           { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    recipient_type:   { type: DataTypes.ENUM('user', 'driver', 'admin'), allowNull: false },
    recipient_number: { type: DataTypes.STRING, allowNull: false },
    otp_code:         { type: DataTypes.STRING, allowNull: false },
    purpose:          { type: DataTypes.ENUM('registration', 'login', 'password_reset'), allowNull: false },
    attempt_count:    { type: DataTypes.SMALLINT, defaultValue: 0 },
    is_used:          { type: DataTypes.BOOLEAN, defaultValue: false },
    expires_at:       { type: DataTypes.DATE, allowNull: false },
}, { tableName: 'otp_verifications', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = OtpVerification;