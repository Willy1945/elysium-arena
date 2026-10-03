import axiosClient from './axiosClient';

export const ratingService = {
  submit: (payload) => axiosClient.post('/ratings', payload),
};