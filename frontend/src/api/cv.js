import api from './axios';

export const getCV = async () => {
    const response = await api.get('/cv');
    return response.data;
};

export const updateCV = async (cvData) => {
    const response = await api.put('/cv', cvData);
    return response.data;
};
