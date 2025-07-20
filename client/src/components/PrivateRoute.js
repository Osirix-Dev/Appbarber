// client/src/components/PrivateRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';

// Este componente verifica se existe um 'token' no localStorage.
// Se não existir, ele redireciona o usuário para a página de login.
const PrivateRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('token'); // '!!' transforma em booleano (true/false)

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;