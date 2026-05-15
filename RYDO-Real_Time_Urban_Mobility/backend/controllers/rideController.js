const Booking = require('../models/Booking');

/* CREATE RIDE — saves to database */
const createRide = async (req, res) => {
    try {
        const { pickup, destination, rideType, distance, fare } = req.body;

        if (!pickup || !destination || !fare || !rideType) {
            return res.status(400).json({ message: 'pickup, destination, rideType and fare are required.' });
        }

        const booking = await Booking.create({
            user_id:                req.user.id,
            vehicle_type_requested: rideType,
            pickup_address:         pickup,
            drop_address:           destination,
            distance_km:            distance || 0,
            fare:                   fare,
            booking_date:           new Date().toISOString().split('T')[0],
            booking_time:           new Date().toTimeString().split(' ')[0],
            booking_status:         'pending',
            payment_status:         'unpaid',
        });

        res.status(201).json({ message: 'Ride created successfully', ride: booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* GET MY RIDES */
const getMyRides = async (req, res) => {
    try {
        const rides = await Booking.findAll({
            where: { user_id: req.user.id },
            order: [['booking_id', 'DESC']],
        });
        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* GET PENDING RIDES (for drivers) */
const getPendingRides = async (req, res) => {
    try {
        const rides = await Booking.findAll({
            where: { booking_status: 'pending' },
            order: [['booking_id', 'DESC']],
        });
        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ACCEPT RIDE */
const acceptRide = async (req, res) => {
    try {
        const ride = await Booking.findByPk(req.params.id);
        if (!ride) return res.status(404).json({ message: 'Ride not found.' });

        await ride.update({
            booking_status: 'confirmed',
            driver_id:      req.user.id,
            driver_name:    req.user.fullName || 'Driver',
        });

        res.json({ message: 'Ride accepted successfully', ride });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* SUBMIT PAYMENT */
const submitPayment = async (req, res) => {
    try {
        const ride = await Booking.findByPk(req.params.id);
        if (!ride) return res.status(404).json({ message: 'Ride not found.' });

        let screenshotUrl = '';
        if (req.file) {
            screenshotUrl = `http://localhost:4000/uploads/payments/${req.file.filename}`;
        }

        await ride.update({
            payment_status:    'pending_verification',
            payment_reference: req.body.paymentReference || '',
            payment_screenshot: screenshotUrl,
        });

        res.json({ message: 'Payment submitted successfully', ride });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* VERIFY PAYMENT */
const verifyPayment = async (req, res) => {
    try {
        const ride = await Booking.findByPk(req.params.id);
        if (!ride) return res.status(404).json({ message: 'Ride not found.' });

        await ride.update({ payment_status: 'verified', booking_status: 'completed' });

        res.json({ message: 'Payment verified successfully', ride });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* REJECT PAYMENT */
const rejectPayment = async (req, res) => {
    try {
        const ride = await Booking.findByPk(req.params.id);
        if (!ride) return res.status(404).json({ message: 'Ride not found.' });

        await ride.update({ payment_status: 'rejected' });

        res.json({ message: 'Payment rejected', ride });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createRide, getMyRides, getPendingRides, acceptRide, submitPayment, verifyPayment, rejectPayment };
