import axiosClient from './axiosClient';

export const transactionService = {
  getAll: (params) => axiosClient.get('/transactions', { params }),
  getById: (id) => axiosClient.get(`/transactions/${id}`),
  getCheckoutable: () => axiosClient.get('/transactions-checkoutable'),
  checkoutSession: (sessionId) => axiosClient.post(`/sessions/${sessionId}/checkout`),
  checkoutOrders: (payload) => axiosClient.post('/orders-checkout', payload),
  pay: (id, method) => axiosClient.post(`/transactions/${id}/pay`, { method }),
  archive: (id) => axiosClient.post(`/transactions/${id}/archive`),
  unarchive: (id) => axiosClient.post(`/transactions/${id}/unarchive`),
};