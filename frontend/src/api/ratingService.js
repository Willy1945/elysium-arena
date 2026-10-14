import axiosClient from './axiosClient';

export const ratingService = {
  submit: (payload) => axiosClient.post('/ratings', payload),
  deleteRating: (id) => axiosClient.delete(`/ratings/${id}`),
  deleteMyRating: () => axiosClient.delete('/my-rating'),
};