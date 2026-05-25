const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    user_id:            { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_name:          { type: DataTypes.STRING, allowNull: false },
    user_number:        { type: DataTypes.STRING, allowNull: false, unique: true },
    user_email:         { type: DataTypes.STRING, unique: true },
    user_password_hash: { type: DataTypes.STRING, allowNull: false },
    user_address:       { type: DataTypes.TEXT },
    profile_photo_url:  { type: DataTypes.TEXT },
    is_active:          { type: DataTypes.BOOLEAN, defaultValue: true },
    is_verified:        { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'users', timestamps: false });

module.exports = User;
