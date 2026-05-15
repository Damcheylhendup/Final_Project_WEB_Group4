const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
    createRide, getMyRides, getPendingRides,
    acceptRide, submitPayment, verifyPayment, rejectPayment
} = require('../controllers/rideController');

router.post('/create',              protect, createRide);
router.get('/my-rides',             protect, getMyRides);
router.get('/pending',              protect, getPendingRides);
router.put('/accept/:id',           protect, acceptRide);
router.put('/payment/:id',          protect, upload.single('paymentScreenshot'), submitPayment);
router.put('/verify-payment/:id',   protect, verifyPayment);
router.put('/reject-payment/:id',   protect, rejectPayment);

module.exports = router;
