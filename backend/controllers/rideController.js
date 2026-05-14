let rides = [];

/* CREATE RIDE */
const createRide = (
  req,
  res
) => {
  try {
    const {
      pickup,
      destination,
      rideType,
      distance,
      fare,
    } = req.body;

    const ride = {
      id: Date.now().toString(),

      riderId:
        req.user.id,

      riderName:
        req.user
          .fullName ||
        'Rider',

      pickup,
      destination,
      rideType,
      distance,
      fare,

      status:
        'Pending',

      paymentStatus:
        'Unpaid',

      paymentReference:
        '',

      paymentScreenshot:
        '',

      driverName: '',

      driverId: '',

      createdAt:
        new Date(),
    };

    rides.push(ride);

    res.status(201).json({
      message:
        'Ride created successfully',

      ride,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

/* GET MY RIDES */
const getMyRides = (
  req,
  res
) => {
  try {
    const userRides =
      rides.filter(
        (ride) =>
          ride.riderId ===
            req.user.id ||
          ride.driverId ===
            req.user.id
      );

    res.json(userRides);
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

/* GET PENDING RIDES */
const getPendingRides = (
  req,
  res
) => {
  try {
    const pendingRides =
      rides.filter(
        (ride) =>
          ride.status ===
          'Pending'
      );

    res.json(
      pendingRides
    );
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

/* ACCEPT RIDE */
const acceptRide = (
  req,
  res
) => {
  try {
    const rideId =
      req.params.id;

    const ride =
      rides.find(
        (ride) =>
          ride.id ===
          rideId
      );

    if (!ride) {
      return res
        .status(404)
        .json({
          message:
            'Ride not found',
        });
    }

    ride.status =
      'Accepted';

    ride.driverId =
      req.user.id;

    ride.driverName =
      req.user
        .fullName ||
      'Driver';

    ride.driverBankName =
      req.user
        .bankName ||
      '';

    ride.driverAccountHolder =
      req.user
        .accountHolder ||
      '';

    ride.driverAccountNumber =
      req.user
        .accountNumber ||
      '';

    ride.driverQrImage =
      req.user
        .qrImage ||
      '';

    res.json({
      message:
        'Ride accepted successfully',

      ride,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

/* SUBMIT PAYMENT */
const submitPayment = (
  req,
  res
) => {
  try {
    const rideId =
      req.params.id;

    const {
      paymentReference,
    } = req.body;

    const ride =
      rides.find(
        (ride) =>
          ride.id ===
          rideId
      );

    if (!ride) {
      return res
        .status(404)
        .json({
          message:
            'Ride not found',
        });
    }

    let screenshotUrl =
      '';

    if (req.file) {
      screenshotUrl = `http://localhost:4000/uploads/payments/${req.file.filename}`;
    }

    ride.paymentStatus =
      'Pending Verification';

    ride.paymentReference =
      paymentReference ||
      '';

    ride.paymentScreenshot =
      screenshotUrl;

    res.json({
      message:
        'Payment submitted successfully',

      ride,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

/* VERIFY PAYMENT */
const verifyPayment = (
  req,
  res
) => {
  try {
    const rideId =
      req.params.id;

    const ride =
      rides.find(
        (ride) =>
          ride.id ===
          rideId
      );

    if (!ride) {
      return res
        .status(404)
        .json({
          message:
            'Ride not found',
        });
    }

    ride.paymentStatus =
      'Verified';

    res.json({
      message:
        'Payment verified successfully',

      ride,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

/* REJECT PAYMENT */
const rejectPayment = (
  req,
  res
) => {
  try {
    const rideId =
      req.params.id;

    const ride =
      rides.find(
        (ride) =>
          ride.id ===
          rideId
      );

    if (!ride) {
      return res
        .status(404)
        .json({
          message:
            'Ride not found',
        });
    }

    ride.paymentStatus =
      'Rejected';

    res.json({
      message:
        'Payment rejected',

      ride,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
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
};