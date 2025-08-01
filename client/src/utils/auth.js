// client/src/utils/auth.js

import { jwtDecode } from 'jwt-decode';

// Função para pegar o token do localStorage
export const getToken = () => {
    return localStorage.getItem('token');
};

// Função para verificar se o token existe e não expirou
export const isLoggedIn = () => {
    const token = getToken();
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        if (Date.now() >= decoded.exp * 1000) {
            localStorage.removeItem('token');
            return false;
        }
    } catch (e) {
        return false;
    }
    return true;
};

// Função para fazer logout
export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; 
};

// Função para pegar os dados do usuário do token
export const getUser = () => {
    const token = getToken();
    if (!token) return null;
    try {
        return jwtDecode(token).user; 
    } catch (e) {
        return null;
    }
};