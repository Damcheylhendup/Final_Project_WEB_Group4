const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SurgePricing = sequelize.define('SurgePricing', {
    surge_id:         { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    vehicle_type:     { type: DataTypes.ENUM('Taxi', 'Car', 'Bus'), allowNull: false },
    surge_multiplier: { type: DataTypes.DECIMAL(4, 2), allowNull: false },
    reason:           { type: DataTypes.STRING },
    start_time:       { type: DataTypes.TIME },
    end_time:         { type: DataTypes.TIME },
    start_date:       { type: DataTypes.DATEONLY },
    end_date:         { type: DataTypes.DATEONLY },
    is_active:        { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'surge_pricing', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

module.exports = SurgePricing;