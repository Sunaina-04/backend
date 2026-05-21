const normalizeUrl = (value) => value.replace(/\/$/, '');

export const API_BASE_URL = normalizeUrl(
  import.meta.env.VITE_API_BASE_URL || 'https://backend-m32d.onrender.com'
);