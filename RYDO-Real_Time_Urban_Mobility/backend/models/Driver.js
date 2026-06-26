const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Driver = sequelize.define('Driver', {
    driver_id:            { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    driver_name:          { type: DataTypes.STRING, allowNull: false },
    driver_number:        { type: DataTypes.STRING, allowNull: false, unique: true },
    driver_email:         { type: DataTypes.STRING, unique: true },
    driver_password_hash: { type: DataTypes.STRING, allowNull: false },
    license_number:       { type: DataTypes.STRING, unique: true },
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

/*
CHANGED: vehicle_type and vehicle_number have been removed from
this model. They now live only on the `Vehicle` model (vehicles
table, keyed on driver_id), to avoid storing the same data in two
places. If your code currently does driver.vehicle_type or
driver.vehicle_number anywhere (e.g. registerDriver, the driver
dashboard, ride-matching logic), you'll need to update those spots
to instead look up the driver's active Vehicle row. I don't have
those controller files in this conversation, so I can't make that
edit directly, but I'm happy to if you paste them in or re-upload.

Example lookup with Sequelize, once you've set up the association:

Driver.hasMany(Vehicle, { foreignKey: 'driver_id' });
Vehicle.belongsTo(Driver, { foreignKey: 'driver_id' });

const driver = await Driver.findByPk(driverId, {
  include: [{ model: Vehicle, where: { is_active: true }, required: false }]
});
// driver.Vehicles[0]?.vehicle_type, driver.Vehicles[0]?.vehicle_number
*/