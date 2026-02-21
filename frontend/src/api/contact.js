import api from './axios';

export const sendContactMessage = async (contactData) => {
    const response = await api.post('/contact', contactData);
    return response.data;
};
