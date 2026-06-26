const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DriverLocation = sequelize.define('DriverLocation', {
    location_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    driver_id:   { type: DataTypes.INTEGER, allowNull: false },
    latitude:    { type: DataTypes.DECIMAL(9, 6), allowNull: false },
    longitude:   { type: DataTypes.DECIMAL(9, 6), allowNull: false },
}, { tableName: 'driver_locations', timestamps: true, createdAt: 'recorded_at', updatedAt: false });

module.exports = DriverLocation;