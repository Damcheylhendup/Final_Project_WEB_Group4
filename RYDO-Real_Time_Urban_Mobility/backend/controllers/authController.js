const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/* REGISTER */
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

        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: user.user_id, fullName: user.user_name, email: user.user_email, phone: user.user_number },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* LOGIN */
const loginUser = async (req, res) => {
    try {
        const { emailOrPhone, password } = req.body;

        if (!emailOrPhone || !password) {
            return res.status(400).json({ message: 'Email/phone and password are required.' });
        }

        const { Op } = require('sequelize');
        const user = await User.findOne({
            where: { [Op.or]: [{ user_email: emailOrPhone }, { user_number: emailOrPhone }] }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.user_password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.user_id, fullName: user.user_name, email: user.user_email, phone: user.user_number },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };
