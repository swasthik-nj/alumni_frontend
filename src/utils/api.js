import axios from 'axios';

const api = axios.create({
  baseURL: 'https://alumni-system-backend-vom2.onrender.com', // adjust if your backend runs on a different port
  withCredentials: true, // important for cookies if using HttpOnly cookies
});

// Attach Authorization header with token from localStorage for every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: handle 401 responses globally (e.g., redirect to login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optionally redirect to login: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
