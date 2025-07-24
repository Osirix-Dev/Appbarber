// client/src/api/axiosConfig.js

import axios from 'axios';

// O endereço do seu back-end que está no ar
const API_URL = 'https://appbarber-tk2b.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptador que adiciona o token em cada requisição
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;