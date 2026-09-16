import axios from 'axios';

// Isoma variable ya Vercel (VITE_API_URL) niba ihari, niba idahari igakoresha localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`
});

// Injects Bearer Token automatically into every single request header structure
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lifeos_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
