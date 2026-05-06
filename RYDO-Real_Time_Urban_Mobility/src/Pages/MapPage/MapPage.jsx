import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, MarkerF, TrafficLayer, useLoadScript } from '@react-google-maps/api';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapPage.css';
import RideChat from './RideChat';

const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' };
// Thimphu, Bhutan (default). Keeps the demo focused on Bhutan.
const DEFAULT_CENTER = { lat: 27.4728, lng: 89.639 };
// Rough bounds for Bhutan to keep the map focused.
const BHUTAN_BOUNDS = {
  north: 28.35,
  south: 26.70,
  west: 88.70,
  east: 92.10,
};

const leafletMarkerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function isProbablyPlaceholderKey(key) {
  if (!key) return true;
  const k = String(key).trim();
  if (!k) return true;
  return (
    k.includes('YOUR_GOOGLE_MAPS_API_KEY') ||
    k.includes('your real key') ||
    k.includes('...') ||
    k === 'YOUR_KEY'
  );
}

function MapPage() {
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const watchIdRef = useRef(null);

  const [ride] = useState(() => {
    const rides = JSON.parse(localStorage.getItem('rides')) || [];
    return rides.length > 0 ? rides[rides.length - 1] : null;
  });
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentRole, setCurrentRole] = useState('passenger');
  const [driverLatLng, setDriverLatLng] = useState(null);
  const [passengerLatLng, setPassengerLatLng] = useState(null);

  const BACKEND_URL = 'http://localhost:4000';
  const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const useGoogleMaps = !isProbablyPlaceholderKey(GOOGLE_MAPS_KEY);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: useGoogleMaps ? GOOGLE_MAPS_KEY : '',
  });

  useEffect(() => {
    if (!ride?.id) return;

    const socket = io(BACKEND_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join-ride', {
        rideId: ride.id,
        role: currentRole,
        userName: currentRole === 'driver' ? 'Driver' : 'Passenger',
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('ride-history', ({ messages: history, latestLocation }) => {
      setMessages(Array.isArray(history) ? history : []);
      if (
        latestLocation &&
        typeof latestLocation.latitude === 'number' &&
        typeof latestLocation.longitude === 'number'
      ) {
        if (latestLocation.role === 'driver') setDriverLatLng([latestLocation.latitude, latestLocation.longitude]);
        if (latestLocation.role === 'passenger') setPassengerLatLng([latestLocation.latitude, latestLocation.longitude]);
      }
    });

    socket.on('location-update', ({ latitude, longitude, role }) => {
      if (typeof latitude !== 'number' || typeof longitude !== 'number') return;
      if (role === 'driver') setDriverLatLng([latitude, longitude]);
      if (role === 'passenger') setPassengerLatLng([latitude, longitude]);
    });

    socket.on('chat-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('participant-joined', (participant) => {
      const notice = {
        id: `join-${participant.ts}`,
        text: `${participant.userName} joined as ${participant.role}`,
        role: 'system',
        userName: 'System',
        ts: participant.ts || Date.now(),
      };
      setMessages((prev) => [...prev, notice]);
    });

    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsConnected(false);
      socketRef.current = null;
      socket.disconnect();
    };
  }, [ride?.id, currentRole]);

  useEffect(() => {
    if (!isConnected || currentRole !== 'driver' || !ride?.id) return;
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        socketRef.current?.emit('update-location', {
          rideId: ride.id,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          heading: position.coords.heading,
        });
      },
      () => {
        // If geolocation fails (permissions/off), keep the app usable with a safe fallback.
      },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 6000 },
    );

    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isConnected, currentRole, ride?.id]);

  const handleSendChat = (text) => {
    if (!socketRef.current || !ride?.id) return;
    socketRef.current.emit('chat-message', { rideId: ride.id, text });
  };

  return (
    <div className="map-page">
      <div className="map-container">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back
        </button>

        <h1>Live Tracking</h1>
        <p className="subtitle">
          Track your driver in real time. {isConnected ? 'Connected to backend.' : 'Connecting...'}
        </p>

        <div className="role-switch">
          <span>Your mode:</span>
          <button
            className={currentRole === 'passenger' ? 'active' : ''}
            onClick={() => setCurrentRole('passenger')}
          >
            Passenger
          </button>
          <button
            className={currentRole === 'driver' ? 'active' : ''}
            onClick={() => setCurrentRole('driver')}
          >
            Driver
          </button>
        </div>

        <div className="map-box">
          {useGoogleMaps && !loadError ? (
            <GoogleMap
              mapContainerStyle={MAP_CONTAINER_STYLE}
              zoom={12}
              center={
                driverLatLng
                  ? { lat: driverLatLng[0], lng: driverLatLng[1] }
                  : passengerLatLng
                    ? { lat: passengerLatLng[0], lng: passengerLatLng[1] }
                    : DEFAULT_CENTER
              }
              options={{
                fullscreenControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                // Hybrid = satellite imagery + labels, best for "satellite traffic" style.
                mapTypeId: 'hybrid',
                restriction: {
                  latLngBounds: BHUTAN_BOUNDS,
                  strictBounds: false,
                },
              }}
            >
              <TrafficLayer autoUpdate />
              {passengerLatLng && (
                <MarkerF
                  position={{ lat: passengerLatLng[0], lng: passengerLatLng[1] }}
                  label="P"
                />
              )}
              {driverLatLng && (
                <MarkerF
                  position={{ lat: driverLatLng[0], lng: driverLatLng[1] }}
                  label="D"
                />
              )}
            </GoogleMap>
          ) : (
            <div className="leaflet-map">
              <MapContainer
                center={
                  driverLatLng
                    ? driverLatLng
                    : passengerLatLng
                      ? passengerLatLng
                      : [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]
                }
                zoom={12}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {passengerLatLng && (
                  <Marker position={passengerLatLng} icon={leafletMarkerIcon}>
                    <Popup>Passenger</Popup>
                  </Marker>
                )}

                {driverLatLng && (
                  <Marker position={driverLatLng} icon={leafletMarkerIcon}>
                    <Popup>Driver</Popup>
                  </Marker>
                )}
              </MapContainer>

              <div style={{ position: 'absolute', left: 12, bottom: 12, background: 'rgba(255,255,255,0.95)', padding: '8px 10px', borderRadius: 12, fontSize: 12, color: '#111', maxWidth: 360 }}>
                {useGoogleMaps ? (
                  <span>
                    Google Maps did not load (key blocked / API disabled / billing). Showing OpenStreetMap fallback.
                  </span>
                ) : (
                  <span>
                    Using OpenStreetMap fallback because Google Maps key is missing/placeholder. Add a real key in <code>.env</code> to use Google Maps.
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {ride ? (
          <>
            <div className="tracking-card">
              <h2>{ride.rideType} Ride</h2>
              <p><strong>Pickup:</strong> {ride.pickup}</p>
              <p><strong>Destination:</strong> {ride.destination}</p>
              <p><strong>Status:</strong> {currentRole === 'driver' ? 'Sharing your live location' : 'Tracking driver location'}</p>
            </div>
            <RideChat
              messages={messages}
              currentRole={currentRole}
              onSend={handleSendChat}
            />
          </>
        ) : (
          <div className="tracking-card">
            <h2>No active ride</h2>
            <p>Please book a ride first.</p>
            <button onClick={() => navigate('/booking')}>Book Ride</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapPage;