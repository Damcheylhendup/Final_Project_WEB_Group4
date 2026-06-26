const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FareConfig = sequelize.define('FareConfig', {
    fare_config_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    vehicle_type:   { type: DataTypes.ENUM('Taxi', 'Car', 'Bus'), allowNull: false, unique: true },
    base_fare:      { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    per_km_rate:    { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    per_min_rate:   { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
    minimum_fare:   { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    is_active:      { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'fare_config', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

module.exports = FareConfig;