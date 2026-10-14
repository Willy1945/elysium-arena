import axiosClient from './axiosClient';

export const rewardService = {
  getMyRewards: () => axiosClient.get('/my-rewards'),
  redeemReward: (catalogId) => axiosClient.post('/rewards/redeem', { catalog_id: catalogId }),
  chooseType: (id, type) => axiosClient.post(`/rewards/${id}/choose`, { type }),
  getAdminRewards: () => axiosClient.get('/admin/loyalty-rewards'),
  deleteReward: (id) => axiosClient.delete(`/rewards/${id}`),
  clearRedeemed: () => axiosClient.delete('/rewards/clear-redeemed'),
};