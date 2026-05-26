const Driver = require('../models/Driver');

const uploadQrCode = async (req, res) => {
    try {

        const driver =
            await Driver.findByPk(req.user.id);

        if (!driver) {
            return res.status(404).json({
                message: 'Driver not found'
            });
        }

        driver.payment_name =
            req.body.paymentName;

        driver.payment_number =
            req.body.paymentNumber;

        if (req.file) {

            driver.qr_code_url =
                `http://localhost:4000/uploads/${req.file.filename}`;

        }

        await driver.save();

        res.json({
            success: true,
            message:
                'Payment details saved'
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const getDriverPaymentInfo = async (req, res) => {
    try {
        const driver = await Driver.findByPk(req.user.id);

        if (!driver) {
            return res.status(404).json({
                message: 'Driver not found'
            });
        }

        res.json({
            payment_name: driver.payment_name,
            payment_number: driver.payment_number,
            qr_code_url: driver.qr_code_url
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    uploadQrCode,
    getDriverPaymentInfo
};