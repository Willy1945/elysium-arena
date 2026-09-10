import axiosClient from './axiosClient';

export const ratingService = {
  submit: (deviceId, payload) => axiosClient.post(`/devices/${deviceId}/ratings`, payload),
};