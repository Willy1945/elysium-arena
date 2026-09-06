import axiosClient from './axiosClient';

export const cafeDashboardService = {
  getSummary: () => axiosClient.get('/cafe-dashboard'),
};                                                                                                                                                                                          