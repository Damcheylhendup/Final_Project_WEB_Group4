import {
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
} from 'react-leaflet';

import L from 'leaflet';

import {
  createRide,
} from '../../api/rideApi';

import 'leaflet/dist/leaflet.css';

import './BookingPage.css';

/* FIX LEAFLET MARKER */
delete L.Icon.Default.prototype
  ._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',

  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',

  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapClickHandler({
  pickupCoords,
  setPickupCoords,
  destinationCoords,
  setDestinationCoords,
  setFormData,
}) {
  const [loadingLocation, setLoadingLocation] =
    useState(false);

  const getAddressFromCoords =
    async (lat, lng) => {
      try {
        setLoadingLocation(true);

        const response =
          await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );

        const data =
          await response.json();

        return (
          data.display_name ||
          `${lat.toFixed(
            5
          )}, ${lng.toFixed(5)}`
        );
      } catch (error) {
        console.log(error);

        return `${lat.toFixed(
          5
        )}, ${lng.toFixed(5)}`;
      } finally {
        setLoadingLocation(false);
      }
    };

  useMapEvents({
    async click(e) {
      const {
        lat,
        lng,
      } = e.latlng;

      /* PICKUP */
      if (!pickupCoords) {
        setPickupCoords([
          lat,
          lng,
        ]);

        const pickupAddress =
          await getAddressFromCoords(
            lat,
            lng
          );

        setFormData(
          (prev) => ({
            ...prev,

            pickup:
              pickupAddress,
          })
        );
      }

      /* DESTINATION */
      else if (
        !destinationCoords
      ) {
        setDestinationCoords([
          lat,
          lng,
        ]);

        const destinationAddress =
          await getAddressFromCoords(
            lat,
            lng
          );

        setFormData(
          (prev) => ({
            ...prev,

            destination:
              destinationAddress,
          })
        );
      }
    },
  });

  return (
    <>
      {loadingLocation && (
        <div className="map-loading">
          Loading location...
        </div>
      )}
    </>
  );
}

function BookingPage() {
  const navigate =
    useNavigate();

  const [formData, setFormData] =
    useState({
      pickup: '',
      destination:
        '',

      rideType: 'Car',
    });

  const [fare, setFare] =
    useState(null);

  const [error, setError] =
    useState('');

  const [pickupCoords, setPickupCoords] =
    useState(null);

  const [
    destinationCoords,
    setDestinationCoords,
  ] = useState(null);

  const rates = {
    Car: 40,

    Taxi: 55,

    Bus: 18,
  };

  const rideOptions = [
    {
      type: 'Car',

      icon: '🚗',

      label: 'Car',

      description:
        'Comfort ride',
    },

    {
      type: 'Taxi',

      icon: '🚕',

      label: 'Taxi',

      description:
        'Standard taxi',
    },

    {
      type: 'Bus',

      icon: '🚌',

      label: 'Bus',

      description:
        'Affordable group ride',
    },
  ];

  const handleRideTypeSelect =
    (type) => {
      setFormData({
        ...formData,

        rideType: type,
      });

      setFare(null);
    };

  const calculateDistance =
    (
      lat1,
      lon1,
      lat2,
      lon2
    ) => {
      const R = 6371;

      const dLat =
        ((lat2 - lat1) *
          Math.PI) /
        180;

      const dLon =
        ((lon2 - lon1) *
          Math.PI) /
        180;

      const a =
        Math.sin(
          dLat / 2
        ) *
          Math.sin(
            dLat / 2
          ) +
        Math.cos(
          (lat1 *
            Math.PI) /
            180
        ) *
          Math.cos(
            (lat2 *
              Math.PI) /
              180
          ) *
          Math.sin(
            dLon / 2
          ) *
          Math.sin(
            dLon / 2
          );

      const c =
        2 *
        Math.atan2(
          Math.sqrt(a),
          Math.sqrt(1 - a)
        );

      return R * c;
    };

  const calculateFare =
    () => {
      if (
        !pickupCoords ||
        !destinationCoords
      ) {
        setError(
          'Please select pickup and destination on the map'
        );

        return;
      }

      const distance =
        calculateDistance(
          pickupCoords[0],
          pickupCoords[1],
          destinationCoords[0],
          destinationCoords[1]
        );

      const roundedDistance =
        distance.toFixed(
          2
        );

      const estimatedFare =
        Math.round(
          distance *
            rates[
              formData
                .rideType
            ]
        );

      setFare({
        distance:
          roundedDistance,

        amount:
          estimatedFare,
      });

      setError('');
    };

  const confirmRide =
    async () => {
      if (!fare) {
        setError(
          'Please calculate fare first'
        );

        return;
      }

      try {
        const response =
          await createRide({
            pickup:
              formData.pickup,

            destination:
              formData.destination,

            rideType:
              formData.rideType,

            distance:
              fare.distance,

            fare:
              fare.amount,

            pickupCoords,

            destinationCoords,
          });

        alert(
          response.data
            .message
        );

        navigate('/trips');
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            'Failed to create ride'
        );
      }
    };

  return (
    <div className="booking-page">
      <div className="booking-card">
        <button
          className="back-btn"
          onClick={() =>
            navigate(
              '/dashboard'
            )
          }
        >
          ← Back
        </button>

        <h1>
          Book a Ride
        </h1>

        <p className="subtitle">
          Select locations
          directly on the
          map.
        </p>

        {/* MAP */}
        <div className="map-wrapper">
          <MapContainer
            center={[
              26.85,
              89.39,
            ]}
            zoom={13}
            className="booking-map"
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapClickHandler
              pickupCoords={
                pickupCoords
              }
              setPickupCoords={
                setPickupCoords
              }
              destinationCoords={
                destinationCoords
              }
              setDestinationCoords={
                setDestinationCoords
              }
              setFormData={
                setFormData
              }
            />

            {pickupCoords && (
              <Marker
                position={
                  pickupCoords
                }
              />
            )}

            {destinationCoords && (
              <Marker
                position={
                  destinationCoords
                }
              />
            )}

            {pickupCoords &&
              destinationCoords && (
                <Polyline
                  positions={[
                    pickupCoords,
                    destinationCoords,
                  ]}
                />
              )}
          </MapContainer>
        </div>

        <div className="booking-form">
          <input
            type="text"
            value={
              formData.pickup
            }
            placeholder="Pickup selected from map"
            readOnly
          />

          <input
            type="text"
            value={
              formData.destination
            }
            placeholder="Destination selected from map"
            readOnly
          />

          <button
            className="reset-map-btn"
            onClick={() => {
              setPickupCoords(
                null
              );

              setDestinationCoords(
                null
              );

              setFare(
                null
              );

              setFormData({
                pickup: '',

                destination:
                  '',

                rideType:
                  formData.rideType,
              });
            }}
          >
            Reset Map
          </button>

          <div className="ride-type-section">
            <p className="ride-type-label">
              Choose ride
              type
            </p>

            <div className="ride-options">
              {rideOptions.map(
                (
                  option
                ) => (
                  <button
                    key={
                      option.type
                    }
                    type="button"
                    className={
                      formData.rideType ===
                      option.type
                        ? 'ride-option selected'
                        : 'ride-option'
                    }
                    onClick={() =>
                      handleRideTypeSelect(
                        option.type
                      )
                    }
                  >
                    <span className="ride-icon">
                      {
                        option.icon
                      }
                    </span>

                    <span className="ride-text">
                      <strong>
                        {
                          option.label
                        }
                      </strong>

                      <small>
                        {
                          option.description
                        }
                      </small>
                    </span>

                    <span className="ride-price">
                      Nu.{' '}
                      {
                        rates[
                          option
                            .type
                        ]
                      }
                      /km
                    </span>
                  </button>
                )
              )}
            </div>
          </div>

          {error && (
            <p className="error-text">
              {error}
            </p>
          )}

          <button
            className="calculate-btn"
            onClick={
              calculateFare
            }
          >
            Calculate Fare
          </button>
        </div>

        {fare && (
          <div className="fare-box">
            <h2>
              Estimated Fare
            </h2>

            <p>
              Distance:{' '}
              {
                fare.distance
              }{' '}
              km
            </p>

            <p>
              Ride Type:{' '}
              {
                formData.rideType
              }
            </p>

            <h3>
              Nu.{' '}
              {fare.amount}
            </h3>

            <button
              className="confirm-btn"
              onClick={
                confirmRide
              }
            >
              Confirm Ride
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingPage;