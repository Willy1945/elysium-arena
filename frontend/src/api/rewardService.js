import axiosClient from './axiosClient';

export const rewardService = {
  getMyRewards: () => axiosClient.get('/my-rewards'),
  chooseType: (id, type) => axiosClient.post(`/rewards/${id}/choose`, { type }),
};