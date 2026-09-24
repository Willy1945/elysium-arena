import axiosClient from './axiosClient';

export const adminFeedbackService = {
  getAll: (params) => axiosClient.get('/feedback', { params }),
  updateStatus: (id, payload) => axiosClient.patch(`/feedback/${id}`, payload),
};