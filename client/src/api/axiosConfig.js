import axios from 'axios';
import { getToken } from '../utils/auth';

// Cria uma instância do Axios
const api = axios.create({
    baseURL: 'http://localhost:5000/api' // Base da nossa URL da API
});

// Isso é um "interceptor": ele roda antes de CADA requisição
api.interceptors.request.use(async (config) => {
    const token = getToken();
    if (token) {
        // Adiciona o cabeçalho 'x-auth-token' com o nosso token
        config.headers['x-auth-token'] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
