import api from './axios';

export const getTranslations = async () => {
    try {
        const response = await api.get('/translations');
        return response.data;
    } catch (error) {
        console.error("Error fetching translations", error);
        throw error;
    }
};

export const updateTranslations = async (language, translations) => {
    try {
        const response = await api.post('/translations', { language, translations });
        return response.data;
    } catch (error) {
        console.error("Error updating translations", error);
        throw error;
    }
};
