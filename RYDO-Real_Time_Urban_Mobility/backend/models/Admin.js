const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Admin = sequelize.define('Admin', {
    admin_id:            { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    admin_name:          { type: DataTypes.STRING, allowNull: false },
    admin_number:        { type: DataTypes.STRING },
    admin_email:         { type: DataTypes.STRING, allowNull: false, unique: true },
    admin_password_hash: { type: DataTypes.STRING, allowNull: false },
    admin_role:          { type: DataTypes.ENUM('super_admin', 'admin', 'support'), defaultValue: 'admin' },
}, { tableName: 'admins', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

module.exports = Admin;