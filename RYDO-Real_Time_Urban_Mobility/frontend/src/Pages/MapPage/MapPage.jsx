import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { getMyRides } from '../../api/rideApi';

import { MapContainer, Marker, TileLayer, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import './MapPage.css';
import RideChat from '../TripsPage/RideChat';

/* ── Custom marker icons ── */
const driverIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/744/744465.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const passengerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

/* ── Auto-pan map when markers move ── */
function MapPanner({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.panTo(center, { animate: true });
  }, [center, map]);
  return null;
}

function MapPage() {
  const navigate   = useNavigate();
  const socketRef  = useRef(null);
  const watchIdRef = useRef(null);

  const [ride,           setRide]           = useState(null);
  const [rideLoading,    setRideLoading]    = useState(true);
  const [isConnected,    setIsConnected]    = useState(false);
  const [messages,       setMessages]       = useState([]);
  const [currentRole,    setCurrentRole]    = useState('passenger');
  const [driverLatLng,   setDriverLatLng]   = useState(null);
  const [passengerLatLng,setPassengerLatLng]= useState(null);
  const [chatOpen,       setChatOpen]       = useState(false);

  const BACKEND_URL = import.meta.env.VITE_SOCKET_URL;

  /* ── Load active ride from API ── */
  useEffect(() => {
    getMyRides()
      .then(res => {
        const active = res.data.find(r =>
          r.booking_status === 'confirmed' || r.booking_status === 'in_progress'
        );
        setRide(active || null);
      })
      .catch(err => console.log('Failed to load ride:', err))
      .finally(() => setRideLoading(false));
  }, []);

  /* ── Socket connection ── */
  useEffect(() => {
    if (!ride?.booking_id) return;

    const socket = io(BACKEND_URL, {
      transports: ['polling', 'websocket'],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join-ride', {
        rideId:   ride.booking_id,
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
      setMessages(prev => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, [ride?.booking_id, currentRole]);

  /* ── Geolocation watch ── */
  useEffect(() => {
    if (!isConnected || !ride?.booking_id) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        socketRef.current?.emit('update-location', {
          rideId: ride.booking_id,
          latitude,
          longitude,
          role: currentRole,
        });

        if (currentRole === 'driver')    setDriverLatLng([latitude, longitude]);
        if (currentRole === 'passenger') setPassengerLatLng([latitude, longitude]);
      },
      (err) => console.log('Geolocation error:', err.message),
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    return () => {
      if (watchIdRef.current)
        navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [isConnected, currentRole, ride?.booking_id]);

  const handleSendChat = (text) => {
    socketRef.current?.emit('chat-message', {
      rideId: ride.booking_id,
      text,
    });
  };

  /* ── Map center: prefer driver location ── */
  const mapCenter = driverLatLng || passengerLatLng || [27.4728, 89.639];

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
            <div className={`live-dot ${isConnected ? 'dot-green' : 'dot-grey'}`}></div>
            <span>{isConnected ? 'Live tracking active' : 'Connecting...'}</span>
          </div>

          <MapContainer
            className="leaflet-map"
            center={mapCenter}
            zoom={14}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Auto-pan to driver */}
            {driverLatLng && <MapPanner center={driverLatLng} />}

            {/* Driver marker */}
            {driverLatLng && (
              <Marker position={driverLatLng} icon={driverIcon}>
              </Marker>
            )}

            {/* Passenger marker */}
            {passengerLatLng && (
              <Marker position={passengerLatLng} icon={passengerIcon}>
              </Marker>
            )}

            {/* Line between driver and passenger */}
            {driverLatLng && passengerLatLng && (
              <Polyline
                positions={[driverLatLng, passengerLatLng]}
                pathOptions={{ color: '#ffb300', weight: 4, dashArray: '8 4' }}
              />
            )}
          </MapContainer>
        </div>

        {/* RIDE INFO */}
        {rideLoading ? (
          <div className="tracking-card">
            <p>Loading ride info...</p>
          </div>
        ) : ride ? (
          <div className="tracking-card">
            <h2>{ride.vehicle_type_requested} Ride</h2>
            <p><strong>Pickup:</strong> {ride.pickup_address}</p>
            <p><strong>Destination:</strong> {ride.drop_address}</p>
            <p><strong>Fare:</strong> Nu. {ride.fare}</p>
            <p><strong>Status:</strong> {ride.booking_status}</p>
            {ride.driver_name && <p><strong>Driver:</strong> {ride.driver_name}</p>}

            <div className="eta-box">
              <h3>🚗 Driver is on the way</h3>
              <p>Live location updates every few seconds</p>
            </div>

            <button className="open-chat-btn" onClick={() => setChatOpen(true)}>
              💬 Open Chat
            </button>
          </div>
        ) : (
          <div className="tracking-card">
            <p>No active ride found.</p>
            <button onClick={() => navigate('/booking')}>Book a Ride</button>
          </div>
        )}

      </div>

      {/* CHAT OVERLAY */}
      {chatOpen && ride && (
        <RideChat
          messages={messages}
          currentRole={currentRole}
          onSend={handleSendChat}
          onClose={() => setChatOpen(false)}
          rideId={String(ride.booking_id)}
          userName={currentRole === 'driver' ? 'Driver' : 'Passenger'}
        />
      )}
    </div>
  );
}

export default MapPage;