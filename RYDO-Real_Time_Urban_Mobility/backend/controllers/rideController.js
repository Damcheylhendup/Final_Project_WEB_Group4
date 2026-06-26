const Booking = require('../models/Booking');
const Driver = require('../models/Driver');

/* CREATE RIDE */
const createRide = async (req, res) => {
    try {

        const {
            pickup,
            destination,
            rideType,
            distance,
            fare,
            pickupCoords,
            destinationCoords
        } = req.body;

        if (!pickup || !destination || !fare || !rideType) {
            return res.status(400).json({
                message:
                    'pickup, destination, rideType and fare are required.'
            });
        }

        const booking = await Booking.create({
            user_id: req.user.id,

            vehicle_type_requested: rideType,

            pickup_address: pickup,
            drop_address: destination,

            distance_km: distance || 0,
            fare,

            pickup_latitude:
                pickupCoords ? pickupCoords[0] : null,

            pickup_longitude:
                pickupCoords ? pickupCoords[1] : null,

            drop_latitude:
                destinationCoords
                    ? destinationCoords[0]
                    : null,

            drop_longitude:
                destinationCoords
                    ? destinationCoords[1]
                    : null,

            booking_date:
                new Date()
                    .toISOString()
                    .split('T')[0],

            booking_time:
                new Date()
                    .toTimeString()
                    .split(' ')[0],

            booking_status: 'pending',
            payment_status: 'unpaid'
        });

        res.status(201).json({
            message: 'Ride created successfully',
            ride: booking
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }
};

/* MY RIDES */
const getMyRides = async (req, res) => {
  try {

    // DRIVER DASHBOARD
    if (req.user.role === 'driver') {

      const rides = await Booking.findAll({
        where: {
          driver_id: req.user.id
        },
        order: [['booking_id', 'DESC']]
      });

      return res.json(rides);
    }

    // RIDER SIDE
    const rides = await Booking.findAll({
      where: {
        user_id: req.user.id
      },
      order: [['booking_id', 'DESC']]
    });

    const ridesWithDriverDetails = [];

    for (const ride of rides) {

      const rideData = ride.toJSON();

      if (ride.driver_id) {

        const driver = await Driver.findByPk(
          ride.driver_id
        );

        if (driver) {

          rideData.payment_name =
            driver.payment_name;

          rideData.payment_number =
            driver.payment_number;

          rideData.qr_code_url =
            driver.qr_code_url;

          rideData.driver_name =
            driver.driver_name;
        }
      }

      ridesWithDriverDetails.push(
        rideData
      );
    }

    res.json(ridesWithDriverDetails);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};
/* PENDING RIDES */
const getPendingRides = async (req, res) => {
    try {

        const rides = await Booking.findAll({
            where: {
                booking_status: 'pending',
                driver_id: null
            },
            order: [['booking_id', 'DESC']]
        });

        res.json(rides);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }
};

/* ACCEPT RIDE */
const acceptRide = async (req, res) => {
    try {

        const ride =
            await Booking.findByPk(
                req.params.id
            );

        if (!ride) {
            return res.status(404).json({
                message: 'Ride not found.'
            });
        }

        if (ride.driver_id) {
            return res.status(400).json({
                message:
                    'Ride already accepted by another driver.'
            });
        }

        await ride.update({
            booking_status: 'confirmed',
            driver_id: req.user.id,
            driver_name:
                req.user.name || 'Driver'
        });

        res.json({
            message:
                'Ride accepted successfully',
            ride
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }
};

/* SUBMIT PAYMENT */
const submitPayment = async (req, res) => {
    try {

        const ride =
            await Booking.findByPk(
                req.params.id
            );

        if (!ride) {
            return res.status(404).json({
                message: 'Ride not found.'
            });
        }

        let screenshotUrl = '';

        if (req.file) {
            screenshotUrl =
                `${process.env.BACKEND_URL || 'http://localhost:4000'}/uploads/payments/${req.file.filename}`;
        }

        await ride.update({
            payment_status:
                'pending_verification',

            payment_reference:
                req.body.paymentReference || '',

            payment_screenshot:
                screenshotUrl
        });

        res.json({
            message:
                'Payment submitted successfully',
            ride
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }
};

/* VERIFY PAYMENT */
const verifyPayment = async (req, res) => {
    try {

        const ride =
            await Booking.findByPk(
                req.params.id
            );

        if (!ride) {
            return res.status(404).json({
                message: 'Ride not found.'
            });
        }

        await ride.update({
            payment_status: 'verified',
            booking_status: 'completed'
        });

        if (ride.driver_id) {

            const driver =
                await Driver.findByPk(
                    ride.driver_id
                );

            if (driver) {

                driver.total_earnings =
                    Number(
                        driver.total_earnings || 0
                    ) +
                    Number(
                        ride.fare || 0
                    );

                driver.completed_rides =
                    Number(
                        driver.completed_rides || 0
                    ) + 1;

                await driver.save();
            }
        }

        res.json({
            message:
                'Payment verified successfully',
            ride
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }
};

/* REJECT PAYMENT */
const rejectPayment = async (req, res) => {
    try {

        const ride =
            await Booking.findByPk(
                req.params.id
            );

        if (!ride) {
            return res.status(404).json({
                message: 'Ride not found.'
            });
        }

        await ride.update({
            payment_status: 'rejected'
        });

        res.json({
            message: 'Payment rejected',
            ride
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }
};
const completeRide = async (req, res) => {
  try {
    const ride = await Booking.findByPk(req.params.id);

    if (!ride) {
      return res.status(404).json({
        message: 'Ride not found'
      });
    }

    await ride.update({
      booking_status: 'completed'
    });

    res.json({
      message: 'Ride completed successfully',
      ride
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createRide,
  getMyRides,
  getPendingRides,
  acceptRide,
  submitPayment,
  verifyPayment,
  rejectPayment,
  completeRide
};