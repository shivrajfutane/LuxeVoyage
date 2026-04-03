// Centralized configuration for LuxeVoyage
export const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000')
  : ''; // Use relative path on Vercel to trigger rewrites
