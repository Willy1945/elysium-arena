import axiosClient from './axiosClient';

export const productService = {
  getAll: (params) => axiosClient.get('/products', { params: { include_inactive: true, ...params } }),
  getById: (id) => axiosClient.get(`/products/${id}`),
  create: (formData) =>
    axiosClient.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => {
    formData.append('_method', 'PUT');
    return axiosClient.post(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  adjustStock: (id, payload) => axiosClient.post(`/products/${id}/adjust-stock`, payload),
  remove: (id) => axiosClient.delete(`/products/${id}`),
};