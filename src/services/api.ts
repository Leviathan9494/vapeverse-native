import axios from 'axios';

// Replace with your deployed backend URL
const API_URL = 'https://vapeverse.onrender.com/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors for auth if needed
api.interceptors.request.use((config) => {
  // Add auth token here if you implement authentication
  return config;
});

export default api;
