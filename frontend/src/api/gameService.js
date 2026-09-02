import axiosClient from './axiosClient';

export const gameService = {
  getAll: (params) => axiosClient.get('/games', { params }),
  getById: (id) => axiosClient.get(`/games/${id}`),
  create: (formData) =>
    axiosClient.post('/games', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, formData) => {
    formData.append('_method', 'PUT');
    return axiosClient.post(`/games/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  remove: (id) => axiosClient.delete(`/games/${id}`),
};