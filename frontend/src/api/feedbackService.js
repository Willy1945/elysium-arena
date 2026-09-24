import axiosClient from './axiosClient';

export const feedbackService = {
  getAll: (params) => axiosClient.get('/feedback', { params }),
  create: (payload) => axiosClient.post('/feedback', payload),
  updateStatus: (id, payload) => axiosClient.patch(`/feedback/${id}`, payload),
};