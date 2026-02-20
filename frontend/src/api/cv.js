import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const getCV = async () => {
    const response = await axios.get(`${API_URL}/cv`);
    return response.data;
};

export const updateCV = async (cvData) => {
    const token = sessionStorage.getItem('token');
    const response = await axios.put(`${API_URL}/cv`, cvData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};
