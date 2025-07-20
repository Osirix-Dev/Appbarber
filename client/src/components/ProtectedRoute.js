import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn()) {
        // Se não estiver logado, redireciona para a página de login
        return <Navigate to="/login" />;
    }
    return children; // Se estiver logado, mostra a página solicitada
};

export default ProtectedRoute;