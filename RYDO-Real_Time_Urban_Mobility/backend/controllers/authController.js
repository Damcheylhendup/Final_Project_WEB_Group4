const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const User    = require('../models/User');
const Driver  = require('../models/Driver');
const Vehicle = require('../models/Vehicle');

/* =========================
   REGISTER RIDER
========================= */
const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !phone || !password) {
      return res.status(400).json({ message: 'Name, phone and password are required.' });
    }

    const existingUser = await User.findOne({ where: { user_number: phone } });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already registered.' });
    }

    if (email) {
      const existingEmail = await User.findOne({ where: { user_email: email } });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists.' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      user_name:          fullName,
      user_email:         email || null,
      user_number:        phone,
      user_password_hash: hashedPassword,
    });

    const token = jwt.sign(
      { id: user.user_id, role: 'rider' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id:       user.user_id,
        fullName: user.user_name,
        email:    user.user_email,
        phone:    user.user_number,
        role:     'rider',
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   REGISTER DRIVER
========================= */
const registerDriver = async (req, res) => {
  try {
    const {
      fullName, email, phone, password,
      licenseNumber,
      bankName, accountHolder, accountNumber, qrImage,
      vehicleType, vehicleNumber,
    } = req.body;

    if (!fullName || !phone || !password) {
      return res.status(400).json({ message: 'Name, phone and password are required.' });
    }

    const existingDriver = await Driver.findOne({ where: { driver_number: phone } });
    if (existingDriver) {
      return res.status(400).json({ message: 'Phone number already registered.' });
    }

    if (email) {
      const existingEmail = await Driver.findOne({ where: { driver_email: email } });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists.' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create driver record
    const driver = await Driver.create({
      driver_name:          fullName,
      driver_email:         email || null,
      driver_number:        phone,
      driver_password_hash: hashedPassword,
      license_number:       licenseNumber || null,
      payment_name:         accountHolder || bankName || null,
      payment_number:       accountNumber || null,
      qr_code_url:          qrImage || null,
    });

    // Save vehicle to Vehicle table
    let vehicle = null;
    if (vehicleType && vehicleNumber) {
      // Normalize vehicleType to match ENUM('Car','Taxi','Bus')
      const normalizedType = vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1).toLowerCase();
      const validTypes = ['Car', 'Taxi', 'Bus'];
      const safeType = validTypes.includes(normalizedType) ? normalizedType : 'Car';

      vehicle = await Vehicle.create({
        driver_id:      driver.driver_id,
        vehicle_number: vehicleNumber,
        vehicle_type:   safeType,
      });
    }

    const token = jwt.sign(
      { id: driver.driver_id, role: 'driver' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Driver registered successfully',
      token,
      user: {
        id:            driver.driver_id,
        fullName:      driver.driver_name,
        email:         driver.driver_email,
        phone:         driver.driver_number,
        role:          'driver',
        licenseNumber: driver.license_number,
        vehicleType:   vehicle?.vehicle_type   || vehicleType   || '',
        vehicleNumber: vehicle?.vehicle_number || vehicleNumber || '',
        bankName:      bankName      || '',
        accountHolder: accountHolder || '',
        accountNumber: accountNumber || '',
        paymentName:   driver.payment_name,
        paymentNumber: driver.payment_number,
        qrCodeUrl:     driver.qr_code_url,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   LOGIN USER OR DRIVER
========================= */
const loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ message: 'Email/phone and password are required.' });
    }

    // CHECK RIDERS
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { user_email:  emailOrPhone },
          { user_number: emailOrPhone },
        ],
      },
    });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.user_password_hash);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }

      const token = jwt.sign(
        { id: user.user_id, role: 'rider' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Login successful',
        token,
        user: {
          id:       user.user_id,
          fullName: user.user_name,
          email:    user.user_email,
          phone:    user.user_number,
          role:     'rider',
        },
      });
    }

    // CHECK DRIVERS — also fetch their vehicle
    const driver = await Driver.findOne({
      where: {
        [Op.or]: [
          { driver_email:  emailOrPhone },
          { driver_number: emailOrPhone },
        ],
      },
    });

    if (driver) {
      const isMatch = await bcrypt.compare(password, driver.driver_password_hash);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }

      // Fetch vehicle info
      const vehicle = await Vehicle.findOne({
        where:  { driver_id: driver.driver_id, is_active: true },
        order:  [['created_at', 'DESC']],
      });

      const token = jwt.sign(
        { id: driver.driver_id, role: 'driver' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Login successful',
        token,
        user: {
          id:            driver.driver_id,
          fullName:      driver.driver_name,
          email:         driver.driver_email,
          phone:         driver.driver_number,
          role:          'driver',
          licenseNumber: driver.license_number,
          vehicleType:   vehicle?.vehicle_type   || '',
          vehicleNumber: vehicle?.vehicle_number || '',
          paymentName:   driver.payment_name,
          paymentNumber: driver.payment_number,
          qrCodeUrl:     driver.qr_code_url,
        },
      });
    }

    return res.status(400).json({ message: 'Invalid credentials.' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, registerDriver, loginUser };