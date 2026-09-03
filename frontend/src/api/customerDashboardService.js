import axiosClient from './axiosClient';

export const customerDashboardService = {
  getSummary: () => axiosClient.get('/my-dashboard'),
};