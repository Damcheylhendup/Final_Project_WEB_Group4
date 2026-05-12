const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* TEMP USERS ARRAY */
/* Later replace with MySQL */
let users = [];

/* REGISTER */
const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role,
      phone,
    } = req.body;

    const existingUser = users.find(
      (user) => user.email === email
    );

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      fullName,
      email,
      phone,
      role,
      password: hashedPassword,
    };

    users.push(newUser);

    res.status(201).json({
      message: 'User registered successfully',
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
    const { email, password } = req.body;

    const user = users.find(
      (user) => user.email === email
    );

    if (!user) {
      return res.status(400).json({
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
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