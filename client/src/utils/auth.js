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
        // Decodifica o token para pegar a data de expiração
        const { exp } = jwtDecode(token);
        // Verifica se a data de expiração é no futuro
        if (Date.now() >= exp * 1000) {
            localStorage.removeItem('token'); // Remove o token expirado
            return false;
        }
    } catch (e) {
        return false;
    }
    return true;
};

// Função para fazer logout
export const logout = (navigate) => {
    localStorage.removeItem('token'); // Remove o token
    navigate('/'); // Redireciona para a home
};

// Função para pegar os dados do usuário do token
export const getUser = () => {
    const token = getToken();
    if (!token) return null;
    try {
        return jwtDecode(token).user; // Retorna o objeto 'user' que colocamos no payload do token
    } catch (e) {
        return null;
    }
};