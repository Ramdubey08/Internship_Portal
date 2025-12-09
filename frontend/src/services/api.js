import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Use environment variable or default to /api for production (nginx proxy)
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL.replace('/api', '')}/api/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => axios.post(`${API_BASE_URL.replace('/api', '')}/api/token/`, credentials),
  register: (userData) => axios.post(`${API_BASE_URL}/register/`, userData),
  refreshToken: (refresh) => axios.post(`${API_BASE_URL.replace('/api', '')}/api/token/refresh/`, { refresh }),
};

// Profile API calls
export const profileAPI = {
  getProfile: () => api.get('/profile/'),
  updateProfile: (data) => api.patch('/profile/', data),
};

// Internship API calls
export const internshipAPI = {
  getAll: (params) => api.get('/internships/', { params }),
  getById: (id) => api.get(`/internships/${id}/`),
  create: (data) => api.post('/internships/', data),
  update: (id, data) => api.put(`/internships/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/internships/${id}/`, data),
  delete: (id) => api.delete(`/internships/${id}/`),
  search: (query) => api.get('/internships/', { params: query }),
};

// Application API calls
export const applicationAPI = {
  getAll: () => api.get('/applications/'),
  getById: (id) => api.get(`/applications/${id}/`),
  create: (data) => api.post('/applications/', data),
  updateStatus: (id, status) => api.patch(`/applications/${id}/`, { status }),
  myApplications: () => api.get('/applications/my_applications/'),
  internshipApplications: (internshipId) => api.get(`/applications/${internshipId}/internship_applications/`),
};

// Helper functions
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  } catch (error) {
    return true;
  }
};

export const getUserFromToken = (token) => {
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

export default api;
