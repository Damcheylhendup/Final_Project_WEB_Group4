import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

import {
  GoogleMap,
  MarkerF,
  TrafficLayer,
  PolylineF,
  useLoadScript,
} from '@react-google-maps/api';

import {
  MapContainer,
  Marker,
  TileLayer,
  Polyline,
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import './MapPage.css';
import RideChat from '../TripsPage/RideChat';

const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' };
const DEFAULT_CENTER      = { lat: 27.4728, lng: 89.639 };

const leafletMarkerIcon = new L.Icon({
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize:      [25, 41],
  iconAnchor:    [12, 41],
});

function MapPage() {
  const navigate    = useNavigate();
  const socketRef   = useRef(null);
  const watchIdRef  = useRef(null);

  const [ride] = useState(() => {
    const rides = JSON.parse(localStorage.getItem('rides')) || [];
    return rides.length > 0 ? rides[rides.length - 1] : null;
  });

  const [isConnected,    setIsConnected]    = useState(false);
  const [messages,       setMessages]       = useState([]);
  const [currentRole,    setCurrentRole]    = useState('passenger');
  const [driverLatLng,   setDriverLatLng]   = useState(null);
  const [passengerLatLng,setPassengerLatLng]= useState(null);
  const [chatOpen,       setChatOpen]       = useState(false); // ← controls chat visibility

  const BACKEND_URL    = 'http://localhost:4000';
  const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_KEY || '',
  });

  /* =========================
     SOCKET SETUP
  ========================= */
  useEffect(() => {
    if (!ride?.id) return;

    const socket = io(BACKEND_URL, {
      transports: ['polling', 'websocket'],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join-ride', {
        rideId:   ride.id,
        role:     currentRole,
        userName: currentRole === 'driver' ? 'Driver' : 'Passenger',
      });
    });

    socket.on('disconnect', () => setIsConnected(false));

    socket.on('location-update', ({ latitude, longitude, role }) => {
      if (role === 'driver')    setDriverLatLng([latitude, longitude]);
      if (role === 'passenger') setPassengerLatLng([latitude, longitude]);
    });

    socket.on('chat-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, [ride?.id, currentRole]);

  /* =========================
     GEOLOCATION WATCH
  ========================= */
  useEffect(() => {
    if (!isConnected) return;

    watchIdRef.current = navigator.geolocation.watchPosition((pos) => {
      socketRef.current?.emit('update-location', {
        rideId:    ride.id,
        latitude:  pos.coords.latitude,
        longitude: pos.coords.longitude,
        role:      currentRole,
      });

      if (currentRole === 'driver')
        setDriverLatLng([pos.coords.latitude, pos.coords.longitude]);
      if (currentRole === 'passenger')
        setPassengerLatLng([pos.coords.latitude, pos.coords.longitude]);
    });

    return () => {
      if (watchIdRef.current)
        navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [isConnected, currentRole, ride?.id]);

  const handleSendChat = (text) => {
    socketRef.current?.emit('chat-message', { rideId: ride.id, text });
  };

  return (
    <div className="map-page">
      <div className="map-container">

        <button className="back-btn" onClick={() => navigate('/trips')}>
          ← Back
        </button>

        {/* HEADER */}
        <div className="map-header">
          <h1>Live Ride Tracking</h1>
          <p>Realtime driver and passenger tracking with chat support.</p>

          <div className="role-switch">
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
        </div>

        {/* MAP */}
        <div className="map-box">
          <div className="live-status">
            <div className="live-dot"></div>
            <span>{isConnected ? 'Live tracking active' : 'Connecting...'}</span>
          </div>

          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={MAP_CONTAINER_STYLE}
              zoom={13}
              center={
                driverLatLng
                  ? { lat: driverLatLng[0], lng: driverLatLng[1] }
                  : DEFAULT_CENTER
              }
            >
              <TrafficLayer />

              {driverLatLng && (
                <MarkerF
                  position={{ lat: driverLatLng[0], lng: driverLatLng[1] }}
                  icon={{
                    url: 'https://cdn-icons-png.flaticon.com/512/744/744465.png',
                    scaledSize: new window.google.maps.Size(50, 50),
                  }}
                />
              )}

              {passengerLatLng && (
                <MarkerF
                  position={{ lat: passengerLatLng[0], lng: passengerLatLng[1] }}
                  icon={{
                    url: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                />
              )}

              {driverLatLng && passengerLatLng && (
                <PolylineF
                  path={[
                    { lat: driverLatLng[0],    lng: driverLatLng[1] },
                    { lat: passengerLatLng[0], lng: passengerLatLng[1] },
                  ]}
                  options={{ strokeColor: '#ffb300', strokeWeight: 5 }}
                />
              )}
            </GoogleMap>
          ) : (
            <MapContainer className="leaflet-map" center={[27.4728, 89.639]} zoom={13}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {driverLatLng    && <Marker position={driverLatLng}    icon={leafletMarkerIcon} />}
              {passengerLatLng && <Marker position={passengerLatLng} icon={leafletMarkerIcon} />}
              {driverLatLng && passengerLatLng && (
                <Polyline positions={[driverLatLng, passengerLatLng]} />
              )}
            </MapContainer>
          )}
        </div>

        {/* RIDE INFO */}
        {ride && (
          <div className="tracking-card">
            <h2>{ride.rideType} Ride</h2>
            <p><strong>Pickup:</strong> {ride.pickup}</p>
            <p><strong>Destination:</strong> {ride.destination}</p>
            <p><strong>Fare:</strong> Nu. {ride.fare}</p>
            <p><strong>Status:</strong> {ride.status || 'Ongoing'}</p>

            <div className="eta-box">
              <h3>ETA: 4 mins</h3>
              <p>Driver is heading to your location</p>
            </div>

            {/* CHAT TOGGLE BUTTON */}
            <button
              className="open-chat-btn"
              onClick={() => setChatOpen(true)}
            >
              💬 Open Chat
            </button>
          </div>
        )}

      </div>

      {/* ← CHAT IS NOW OUTSIDE map-container, floats bottom-right */}
      {chatOpen && ride && (
        <RideChat
          messages={messages}
          currentRole={currentRole}
          onSend={handleSendChat}
          onClose={() => setChatOpen(false)}
          rideId={String(ride.id)}
          userName={currentRole === 'driver' ? 'Driver' : 'Passenger'}
        />
      )}
    </div>
  );
}

export default MapPage;
