import axiosClient from './axiosClient';

export const authService = {
  login: (credentials) => axiosClient.post('/login', credentials),
  register: (data) => axiosClient.post('/register', data),
  logout: () => axiosClient.post('/logout'),
  getProfile: () => axiosClient.get('/profile'),
  updateProfile: (formData) => axiosClient.post('/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};