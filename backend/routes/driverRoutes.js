const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const {
    uploadQrCode,
    getDriverPaymentInfo
} = require('../controllers/driverPaymentController');

router.put(
    '/upload-qr',
    protect,
    upload.single('qr'),
    uploadQrCode
);

router.get(
    '/payment-info',
    protect,
    getDriverPaymentInfo
);

module.exports = router;