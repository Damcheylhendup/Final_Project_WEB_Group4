import {
  useEffect,
  useState,
  useRef,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  getMyRides,
  submitPayment,
} from '../../api/rideApi';

import './PaymentsPage.css';

function PaymentsPage() {
  const navigate =
    useNavigate();

  const [latestRide, setLatestRide] =
    useState(null);

  const [reference, setReference] =
    useState('');

  const [screenshot, setScreenshot] =
    useState(null);

  const [dragOver, setDragOver] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadLatestRide();
  }, []);

  const loadLatestRide =
    async () => {
      try {
        const response =
          await getMyRides();

        const rides =
          response.data || [];

        if (rides.length > 0) {
          setLatestRide(rides[0]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  const handleFile = (file) => {
    if (
      !file ||
      !file.type.startsWith(
        'image/'
      )
    )
      return;

    const reader =
      new FileReader();

    reader.onload = (e) => {
      setScreenshot({
        file,
        preview:
          e.target.result,
      });
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setDragOver(false);

    handleFile(
      e.dataTransfer.files[0]
    );
  };

  const removeScreenshot =
    () => {
      setScreenshot(null);

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          '';
      }
    };

  const handlePayment =
    async () => {
      if (!latestRide) {
        alert(
          'No ride found'
        );

        return;
      }

      if (
        !reference.trim() &&
        !screenshot
      ) {
        alert(
          'Please enter a payment reference number or upload a screenshot'
        );

        return;
      }

      try {
        const formData =
          new FormData();

        formData.append(
          'paymentReference',
          reference
        );

        if (
          screenshot?.file
        ) {
          formData.append(
            'paymentScreenshot',
            screenshot.file
          );
        }

        const response =
          await submitPayment(
          latestRide.booking_id,
            formData
        );
        alert(
          response.data
            .message
        );

        navigate('/trips');
      } catch (error) {
        alert(
          error.response?.data
            ?.message ||
            'Payment failed'
        );
      }
    };

  return (
    <div className="payments-page">
      <div className="payments-card">
        <button
          className="back-btn"
          onClick={() =>
            navigate('/trips')
          }
        >
          ← Back
        </button>

        <h1>Payment</h1>

        <p className="subtitle">
          Complete your payment
          using the accepted
          driver's bank details.
        </p>

        {loading ? (
          <div className="empty-payment">
            <h2>
              Loading...
            </h2>
          </div>
        ) : !latestRide ? (
          <div className="empty-payment">
            <h2>
              No ride found
            </h2>

            <p>
              Please book a
              ride before
              making payment.
            </p>

            <button
              onClick={() =>
                navigate(
                  '/booking'
                )
              }
            >
              Book Ride
            </button>
          </div>
        ) : (
          <>
            <div className="payment-summary">
              <h2>
                Ride Summary
              </h2>

              <p>
                <strong>
                  Pickup:
                </strong>{' '}
                {
                  latestRide.pickup_address
                }
              </p>

              <p>
                <strong>
                  Destination:
                </strong>{' '}
                {
                  latestRide.drop_address
                }
              </p>

              <p>
                <strong>
                  Ride Type:
                </strong>{' '}
                {
                  latestRide.vehicle_type_request
                }
              </p>

              <p>
                <strong>
                  Distance:
                </strong>{' '}
                {
                  latestRide.distance_km
                }{' '}
                km
              </p>

              <p>
                <strong>
                  Status:
                </strong>{' '}
                {
                  latestRide.booking_status
                }
              </p>

              <p>
                <strong>
                  Payment:
                </strong>{' '}
                {latestRide.payment_Status ||
                  'Unpaid'}
              </p>

              <h3>
                Total: Nu.{' '}
                {
                  latestRide.fare
                }
              </h3>
            </div>

            <div className="driver-payment-details">
              <h2>
                Driver Payment
                Details
              </h2>

              <p>
  <strong>Driver:</strong>{' '}
  {latestRide.driver_name ||
    'Not assigned yet'}
</p>

<p>
  <strong>Bank:</strong>{' '}
  {latestRide.payment_name ||
    'Not provided'}
</p>

<p>
  <strong>Account Holder:</strong>{' '}
  {latestRide.payment_name ||
    'Not provided'}
</p>

<p>
  <strong>Account Number:</strong>{' '}
  {latestRide.payment_number ||
    'Not provided'}
</p>
              <p>
                <strong>
                  Account
                  Number:
                </strong>{' '}
                {latestRide.driverAccountNumber ||
                  'Not provided'}
              </p>
            </div>

            <div className="qr-box">
              {latestRide.qr_code_url ? (
  <img
    src={latestRide.qr_code_url}
    alt="Driver payment QR"
    className="payment-qr-image"
    style={{
      width: '220px',
      height: '220px',
      objectFit: 'contain'
    }}
  />
) : (
  <div className="fake-qr">
    QR
  </div>
)}
              <p>
                Scan using
                mBoB / Mpay /
                Bank app
              </p>
            </div>

            {latestRide.status ===
              'Pending' && (
              <p className="payment-warning">
                A driver has
                not accepted
                this ride yet.
                Payment details
                may be
                incomplete.
              </p>
            )}

            <input
              type="text"
              placeholder="Enter payment reference number"
              value={reference}
              onChange={(e) =>
                setReference(
                  e.target.value
                )
              }
              className="payment-input"
            />

            <div className="payment-divider">
              <span>
                or upload
                payment
                screenshot
              </span>
            </div>

            {screenshot ? (
              <div className="screenshot-preview">
                <img
                  src={
                    screenshot.preview
                  }
                  alt="Payment screenshot"
                  className="screenshot-img"
                />

                <div className="screenshot-meta">
                  <span className="screenshot-name">
                    {
                      screenshot.file
                        .name
                    }
                  </span>

                  <button
                    className="screenshot-remove"
                    onClick={
                      removeScreenshot
                    }
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`screenshot-dropzone${
                  dragOver
                    ? ' dragover'
                    : ''
                }`}
                onDragOver={(
                  e
                ) => {
                  e.preventDefault();

                  setDragOver(
                    true
                  );
                }}
                onDragLeave={() =>
                  setDragOver(
                    false
                  )
                }
                onDrop={
                  handleDrop
                }
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >
                <span className="dropzone-icon">
                  📎
                </span>

                <p className="dropzone-text">
                  Drag & drop
                  screenshot,
                  or{' '}
                  <span className="dropzone-browse">
                    browse
                  </span>
                </p>

                <p className="dropzone-subtext">
                  PNG, JPG,
                  WEBP
                  supported
                </p>

                <input
                  ref={
                    fileInputRef
                  }
                  type="file"
                  accept="image/*"
                  style={{
                    display:
                      'none',
                  }}
                  onChange={(
                    e
                  ) =>
                    handleFile(
                      e.target
                        .files[0]
                    )
                  }
                />
              </div>
            )}

            <button
              className="pay-btn"
              onClick={
                handlePayment
              }
            >
              Submit Payment
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentsPage;