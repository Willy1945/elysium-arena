import axiosClient from './axiosClient';

export const sessionService = {
  getActive: () => axiosClient.get('/sessions/active'),
  getAll: (params) => axiosClient.get('/sessions', { params }),
  start: (payload) => axiosClient.post('/sessions/start', payload),
  extend: (id, additionalMinutes) => axiosClient.post(`/sessions/${id}/extend`, { additional_minutes: additionalMinutes }),
  end: (id) => axiosClient.post(`/sessions/${id}/end`),
};