import axios from 'axios';

const API = axios.create({
  baseURL:
    'http://localhost:4000/api',
});

/* ATTACH JWT TOKEN */
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

/* CREATE RIDE */
export const createRide = (
  rideData
) =>
  API.post(
    '/rides/create',
    rideData
  );

/* GET MY RIDES */
export const getMyRides =
  () =>
    API.get(
      '/rides/my-rides'
    );

/* GET PENDING RIDES */
export const getPendingRides =
  () =>
    API.get(
      '/rides/pending'
    );

/* ACCEPT RIDE */
export const acceptRide = (
  rideId
) =>
  API.put(
    `/rides/accept/${rideId}`
  );

/* SUBMIT PAYMENT */
export const submitPayment =
  (
    rideId,
    formData
  ) =>
    API.put(
      `/rides/payment/${rideId}`,
      formData,
      {
        headers: {
          'Content-Type':
            'multipart/form-data',
        },
      }
    );

/* VERIFY PAYMENT */
export const verifyPayment =
  (rideId) =>
    API.put(
      `/rides/verify-payment/${rideId}`
    );

/* REJECT PAYMENT */
export const rejectPayment =
  (rideId) =>
    API.put(
      `/rides/reject-payment/${rideId}`
    );