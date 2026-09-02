import axiosClient from './axiosClient';

export const categoryService = {
  getAll: () => axiosClient.get('/categories'),
  create: (name) => axiosClient.post('/categories', { name }),
  update: (id, name) => axiosClient.put(`/categories/${id}`, { name }),
  remove: (id) => axiosClient.delete(`/categories/${id}`),
};