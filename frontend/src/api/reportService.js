import axiosClient from './axiosClient';

export const reportService = {
  getRevenue: (params) => axiosClient.get('/reports/revenue', { params }),
  getGaming: (params) => axiosClient.get('/reports/gaming', { params }),
  getFood: (params) => axiosClient.get('/reports/food', { params }),
  getInventory: () => axiosClient.get('/reports/inventory'),
};