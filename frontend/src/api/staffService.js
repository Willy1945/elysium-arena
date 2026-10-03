import axiosClient from './axiosClient';

export const staffService = {
  getAll: (params) => axiosClient.get('/staff', { params }),
  create: (data) => axiosClient.post('/staff', data),
  update: (id, data) => axiosClient.put(`/staff/${id}`, data),
  toggleStatus: (id) => axiosClient.patch(`/staff/${id}/status`),
};