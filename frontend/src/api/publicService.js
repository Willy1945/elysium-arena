import axiosClient from './axiosClient';

export const publicService = {
  getDevices: (params) => axiosClient.get('/public/devices', { params }),
  getDeviceById: (id) => axiosClient.get(`/public/devices/${id}`),
  getGames: (params) => axiosClient.get('/public/games', { params }),
  getGameById: (id) => axiosClient.get(`/public/games/${id}`),
  getCategories: () => axiosClient.get('/public/categories'),
  getProducts: (params) => axiosClient.get('/public/products', { params }),   
  getDeviceRatings: (deviceId) => axiosClient.get(`/public/devices/${deviceId}/ratings`),
  getRecentReviews: (limit = 9) => axiosClient.get('/public/reviews', { params: { limit } }),
  getOccupancyStats: () => axiosClient.get('/public/occupancy-stats'),  
};