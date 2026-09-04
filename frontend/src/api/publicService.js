import axiosClient from './axiosClient';

export const publicService = {
  getDevices: (params) => axiosClient.get('/public/devices', { params }),
  getDeviceById: (id) => axiosClient.get(`/public/devices/${id}`),
  getGames: (params) => axiosClient.get('/public/games', { params }),
  getGameById: (id) => axiosClient.get(`/public/games/${id}`),
};