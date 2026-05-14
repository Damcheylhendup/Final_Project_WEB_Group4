const express = require('express');

const router =
  express.Router();

const protect =
  require(
    '../middleware/authMiddleware'
  );

const upload =
  require(
    '../middleware/uploadMiddleware'
  );

const {
  createRide,
  getMyRides,
  getPendingRides,
  acceptRide,
  submitPayment,
  verifyPayment,
  rejectPayment,
} = require(
  '../controllers/rideController'
);

/* CREATE RIDE */
router.post(
  '/create',
  protect,
  createRide
);

/* GET MY RIDES */
router.get(
  '/my-rides',
  protect,
  getMyRides
);

/* GET PENDING RIDES */
router.get(
  '/pending',
  protect,
  getPendingRides
);

/* ACCEPT RIDE */
router.put(
  '/accept/:id',
  protect,
  acceptRide
);

/* SUBMIT PAYMENT */
router.put(
  '/payment/:id',
  protect,
  upload.single(
    'paymentScreenshot'
  ),
  submitPayment
);

/* VERIFY PAYMENT */
router.put(
  '/verify-payment/:id',
  protect,
  verifyPayment
);

/* REJECT PAYMENT */
router.put(
  '/reject-payment/:id',
  protect,
  rejectPayment
);

module.exports = router;