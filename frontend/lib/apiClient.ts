import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-logout when backend rejects token as expired/invalid
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? '';
    const isAuthError =
      error.response?.status === 401 ||
      (error.response?.status === 400 && message.toLowerCase().includes('jwt'));

    if (isAuthError && typeof window !== 'undefined') {
      localStorage.removeItem('jwt_token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export const getImageUrl = (url?: string | null) => {
  if (!url || url === 'null' || url.trim() === '') return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default apiClient;