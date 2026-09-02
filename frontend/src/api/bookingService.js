import axiosClient from './axiosClient';

export const bookingService = {
  getAll: (params) => axiosClient.get('/bookings', { params }),
  getById: (id) => axiosClient.get(`/bookings/${id}`),
  getAvailability: (deviceId, date) =>
    axiosClient.get(`/devices/${deviceId}/availability`, { params: { date } }),
  create: (payload) => axiosClient.post('/bookings', payload),
  updateStatus: (id, status) => axiosClient.patch(`/bookings/${id}/status`, { status }),
  remove: (id) => axiosClient.delete(`/bookings/${id}`),   // ← baru
};