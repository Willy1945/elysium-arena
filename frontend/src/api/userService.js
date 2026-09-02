import axiosClient from './axiosClient';

export const userService = {
  search: (params) => axiosClient.get('/users', { params }),
};