const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BookingStatusHistory = sequelize.define('BookingStatusHistory', {
    id:           { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    booking_id:   { type: DataTypes.INTEGER, allowNull: false },
    status_value: { type: DataTypes.ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled'), allowNull: false },
    changed_by:   { type: DataTypes.ENUM('user', 'driver', 'admin', 'system'), defaultValue: 'system' },
}, { tableName: 'booking_status_history', timestamps: true, createdAt: 'changed_at', updatedAt: false });

module.exports = BookingStatusHistory;