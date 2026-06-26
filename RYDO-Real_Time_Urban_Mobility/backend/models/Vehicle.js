const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Vehicle = sequelize.define('Vehicle', {
    vehicle_id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    driver_id:           { type: DataTypes.INTEGER, allowNull: false },
    vehicle_number:      { type: DataTypes.STRING, allowNull: false, unique: true },
    vehicle_type:        { type: DataTypes.ENUM('Car', 'Taxi', 'Bus'), allowNull: false },
    vehicle_make:        { type: DataTypes.STRING },
    vehicle_model:       { type: DataTypes.STRING },
    vehicle_year:        { type: DataTypes.SMALLINT },
    vehicle_color:       { type: DataTypes.STRING },
    insurance_number:    { type: DataTypes.STRING },
    insurance_expiry:    { type: DataTypes.DATEONLY },
    registration_expiry: { type: DataTypes.DATEONLY },
    is_active:           { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'vehicles', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

module.exports = Vehicle;