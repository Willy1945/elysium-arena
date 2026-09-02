import axiosClient from './axiosClient';

export const authService = {
  register: (data) => axiosClient.post('/register', data),
  login: (data) => axiosClient.post('/login', data),
  logout: () => axiosClient.post('/logout'),
  getProfile: () => axiosClient.get('/profile'),
  updateProfile: (data) => axiosClient.put('/profile', data),
};