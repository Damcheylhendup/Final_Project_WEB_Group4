const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Booking = sequelize.define('Booking', {
    booking_id:             { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id:                { type: DataTypes.INTEGER, allowNull: false },
    driver_id:              { type: DataTypes.INTEGER },
    vehicle_type_requested: { type: DataTypes.ENUM('Car','Taxi','Bus'), allowNull: false },
    pickup_address:         { type: DataTypes.TEXT, allowNull: false },
    pickup_latitude:        { type: DataTypes.DECIMAL(9,6) },
    pickup_longitude:       { type: DataTypes.DECIMAL(9,6) },
    drop_address:           { type: DataTypes.TEXT, allowNull: false },
    drop_latitude:          { type: DataTypes.DECIMAL(9,6) },
    drop_longitude:         { type: DataTypes.DECIMAL(9,6) },
    distance_km:            { type: DataTypes.DECIMAL(8,2), defaultValue: 0 },
    booking_date:           { type: DataTypes.DATEONLY },
    booking_time:           { type: DataTypes.TIME },
    fare:                   { type: DataTypes.DECIMAL(10,2), allowNull: false },
    final_fare:             { type: DataTypes.DECIMAL(10,2) },
    booking_status:         { type: DataTypes.ENUM('pending','confirmed','in_progress','completed','cancelled'), defaultValue: 'pending' },
    cancellation_reason:    { type: DataTypes.TEXT },
    payment_status:         { type: DataTypes.ENUM('unpaid','pending_verification','verified','rejected'), defaultValue: 'unpaid' },
    payment_reference:      { type: DataTypes.STRING },
    payment_screenshot:     { type: DataTypes.TEXT },
    driver_name:            { type: DataTypes.STRING },
}, { tableName: 'bookings', timestamps: false });

module.exports = Booking;