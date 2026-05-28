import axios from 'axios';

const API = axios.create({
  baseURL: 'https://rydo-backend.onrender.com/api',
});

/* ATTACH JWT TOKEN TO ALL REQUESTS */
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const registerUser   = (userData) => API.post('/auth/register',        userData);
export const registerDriver = (userData) => API.post('/auth/register-driver', userData); // FIX: added
export const loginUser      = (userData) => API.post('/auth/login',           userData);