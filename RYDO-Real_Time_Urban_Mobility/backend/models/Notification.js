const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notification = sequelize.define('Notification', {
    notification_id:   { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    recipient_type:    { type: DataTypes.ENUM('user', 'driver', 'admin'), allowNull: false },
    recipient_id:      { type: DataTypes.INTEGER, allowNull: false },
    title:             { type: DataTypes.STRING, allowNull: false },
    message:           { type: DataTypes.TEXT, allowNull: false },
    notification_type: {
        type: DataTypes.ENUM(
            'booking_confirmed', 'driver_assigned', 'driver_arrived',
            'trip_started', 'trip_completed', 'payment_received',
            'booking_cancelled', 'otp', 'general'
        ),
        allowNull: false,
    },
    booking_id: { type: DataTypes.INTEGER },
    channel:    { type: DataTypes.ENUM('push', 'sms', 'email', 'in_app'), defaultValue: 'in_app' },
    is_sent:    { type: DataTypes.BOOLEAN, defaultValue: false },
    is_read:    { type: DataTypes.BOOLEAN, defaultValue: false },
    sent_at:    { type: DataTypes.DATE },
}, { tableName: 'notifications', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = Notification;