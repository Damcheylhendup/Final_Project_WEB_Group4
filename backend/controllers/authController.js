const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const User = require('../models/User');

/* REGISTER */
const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      role,
    } = req.body;

    const existingUser = await User.findOne({
      where: {
        user_email: email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      user_name: fullName,
      user_email: email,
      user_number: phone,
      user_password_hash: hashedPassword,

      // IMPORTANT
      role: role || 'rider',
    });

    const token = jwt.sign(
      {
        id: user.user_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,

      user: {
        id: user.user_id,
        fullName: user.user_name,
        email: user.user_email,
        phone: user.user_number,

        // IMPORTANT
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* LOGIN */
const loginUser = async (req, res) => {
  try {
    const {
      emailOrPhone,
      password,
    } = req.body;

    const user = await User.findOne({
      where: {
        [Op.or]: [
          {
            user_email: emailOrPhone,
          },
          {
            user_number: emailOrPhone,
          },
        ],
      },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.user_password_hash
    );

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      {
        id: user.user_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.json({
      message: 'Login successful',
      token,

      user: {
        id: user.user_id,
        fullName: user.user_name,
        email: user.user_email,
        phone: user.user_number,

        // IMPORTANT
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};