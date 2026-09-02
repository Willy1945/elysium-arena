import axiosClient from './axiosClient';

export const deviceService = {
    getAll: (params) => axiosClient.get('/devices', { params }),
    getById: (id) => axiosClient.get(`/devices/${id}`),
    create: (formData) =>
        axiosClient.post('/devices', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    update: (id, formData) => {
        formData.append('_method', 'PUT');
        return axiosClient.post(`/devices/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    updateStatus: (id, status) => axiosClient.patch(`/devices/${id}/status`, { status }),
    syncGames: (id, gameIds) => axiosClient.post(`/devices/${id}/games`, { game_ids: gameIds }),
    remove: (id) => axiosClient.delete(`/devices/${id}`),
};

export const deviceTypeService = {
    getAll: () => axiosClient.get('/device-types'),
};