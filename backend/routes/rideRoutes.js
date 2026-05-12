const express = require('express');

const router = express.Router();

const protect = require('../middleware/authMiddleware');

const allowRoles = require(
  '../middleware/roleMiddleware'
);

/* ANY LOGGED IN USER */
router.get(
  '/my-rides',
  protect,
  (req, res) => {
    res.json({
      message: 'Protected rides route',
      user: req.user,
    });
  }
);

/* DRIVER ONLY */
router.get(
  '/driver',
  protect,
  allowRoles('Driver'),
  (req, res) => {
    res.json({
      message:
        'Driver dashboard route',
    });
  }
);

module.exports = router;