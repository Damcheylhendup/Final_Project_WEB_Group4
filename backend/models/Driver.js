const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Driver = sequelize.define('Driver', {
    driver_id:            { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    driver_name:          { type: DataTypes.STRING, allowNull: false },
    driver_number:        { type: DataTypes.STRING, allowNull: false, unique: true },
    driver_email:         { type: DataTypes.STRING, unique: true },
    driver_password_hash: { type: DataTypes.STRING, allowNull: false },
    license_number:       { type: DataTypes.STRING, unique: true },
    vehicle_type:         {type: DataTypes.STRING},
    vehicle_number:       {type: DataTypes.STRING},
    driver_photo_url:     { type: DataTypes.TEXT },
    is_verified:          { type: DataTypes.BOOLEAN, defaultValue: false },
    driver_status:        { type: DataTypes.ENUM('active', 'inactive', 'suspended'), defaultValue: 'active' },
    avg_rating:           { type: DataTypes.DECIMAL(3, 2), defaultValue: 0.00 },
    is_available:         { type: DataTypes.BOOLEAN, defaultValue: true },
    current_latitude:     { type: DataTypes.DECIMAL(9, 6) },
    current_longitude:    { type: DataTypes.DECIMAL(9, 6) },
    last_location_updated:{ type: DataTypes.DATE },
    payment_name:         { type: DataTypes.STRING},
    payment_number:       { type: DataTypes.STRING},
    qr_code_url:          {type: DataTypes.TEXT},
}, { tableName: 'drivers', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

module.exports = Driver;