const express = require('express');
const router = express.Router();
const { registerUser, registerDriver, loginUser } = require('../controllers/authController');

router.post('/register',        registerUser);
router.post('/register-driver', registerDriver);  // FIX: added driver registration route
router.post('/login',           loginUser);

module.exports = router;