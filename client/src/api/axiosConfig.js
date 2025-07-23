// client/src/api/axiosConfig.js

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(config => {
    // ADICIONE ESTES CONSOLE.LOG PARA DEBUGAR
    console.log('>>> Interceptor do Axios foi executado!');
    const token = localStorage.getItem('token');

    if (token) {
        console.log('>>> Token encontrado e sendo enviado!');
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.log('>>> Nenhum token encontrado no localStorage.');
    }

    return config;
}, error => {
    return Promise.reject(error);
});

export default api;
console.log('--- Módulo axiosConfig.js foi carregado ---');