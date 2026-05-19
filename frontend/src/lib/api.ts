import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://bookdrop-i2tm.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Automatically attach token to every request if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
export { API_BASE_URL };
