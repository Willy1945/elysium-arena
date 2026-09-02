import axiosClient from './axiosClient';

export const dashboardService = {
  getSummary: () => axiosClient.get('/dashboard'),
};