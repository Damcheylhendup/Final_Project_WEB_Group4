const express = require('express');
const router = express.Router();
const { registerUser, registerDriver, loginUser } = require('../controllers/authController');

router.post('/register',        registerUser);
router.post('/register-driver', registerDriver);
router.post('/login',           loginUser);  // handles both riders AND drivers

module.exports = router;