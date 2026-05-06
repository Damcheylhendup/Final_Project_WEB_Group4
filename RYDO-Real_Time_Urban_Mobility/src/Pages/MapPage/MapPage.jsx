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
const DEFAULT_CENTER = { lat: 27.4728, lng: 89.639 };

const leafletMarkerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

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

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_KEY || '',
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
      });
    });

    socket.on('disconnect', () => setIsConnected(false));

    socket.on('location-update', ({ latitude, longitude, role }) => {
      if (role === 'driver') setDriverLatLng([latitude, longitude]);
      if (role === 'passenger') setPassengerLatLng([latitude, longitude]);
    });

    socket.on('chat-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, [ride?.id, currentRole]);

  useEffect(() => {
    if (!isConnected || currentRole !== 'driver') return;

    watchIdRef.current = navigator.geolocation.watchPosition((pos) => {
      socketRef.current?.emit('update-location', {
        rideId: ride.id,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    });

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [isConnected, currentRole]);

  const handleSendChat = (text) => {
    socketRef.current?.emit('chat-message', { rideId: ride.id, text });
  };

  return (
    <div className="map-page">
      <div className="map-container">
        <button onClick={() => navigate('/trips')}>← Back</button>

        <h1>Live Tracking</h1>
        <p>{isConnected ? 'Connected' : 'Connecting...'}</p>

        <div>
          <button onClick={() => setCurrentRole('passenger')}>Passenger</button>
          <button onClick={() => setCurrentRole('driver')}>Driver</button>
        </div>

        <div className="map-box">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={MAP_CONTAINER_STYLE}
              zoom={12}
              center={
                driverLatLng
                  ? { lat: driverLatLng[0], lng: driverLatLng[1] }
                  : DEFAULT_CENTER
              }
            >
              <TrafficLayer />
              {driverLatLng && (
                <MarkerF position={{ lat: driverLatLng[0], lng: driverLatLng[1] }} />
              )}
              {passengerLatLng && (
                <MarkerF position={{ lat: passengerLatLng[0], lng: passengerLatLng[1] }} />
              )}
            </GoogleMap>
          ) : (
            <MapContainer center={[27.4728, 89.639]} zoom={12}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {driverLatLng && <Marker position={driverLatLng} icon={leafletMarkerIcon} />}
              {passengerLatLng && <Marker position={passengerLatLng} icon={leafletMarkerIcon} />}
            </MapContainer>
          )}
        </div>

        {ride && (
          <>
            <div>
              <h2>{ride.rideType}</h2>
              <p>{ride.pickup} → {ride.destination}</p>
            </div>

            <RideChat
              messages={messages}
              currentRole={currentRole}
              onSend={handleSendChat}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default MapPage;