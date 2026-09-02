import axiosClient from './axiosClient';

export const orderService = {
  getAll: (params) => axiosClient.get('/orders', { params }),
  getById: (id) => axiosClient.get(`/orders/${id}`),
  create: (payload) => axiosClient.post('/orders', payload),
  updateStatus: (id, status) => axiosClient.patch(`/orders/${id}/status`, { status }),
};