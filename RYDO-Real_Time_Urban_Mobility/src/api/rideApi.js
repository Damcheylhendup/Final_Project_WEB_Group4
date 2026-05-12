import axios from 'axios';

const API = axios.create({
  baseURL:
    'http://localhost:4000/api',
});

API.interceptors.request.use(
  (req) => {
    const token =
      localStorage.getItem(
        'token'
      );

    if (token) {
      req.headers.Authorization =
        `Bearer ${token}`;
    }

    return req;
  }
);

export const createRide = (
  rideData
) =>
  API.post(
    '/rides/create',
    rideData
  );

export const getMyRides =
  () =>
    API.get(
      '/rides/my-rides'
    );

export const getPendingRides =
  () =>
    API.get(
      '/rides/pending'
    );

export const acceptRide = (
  rideId
) =>
  API.put(
    `/rides/accept/${rideId}`
  );