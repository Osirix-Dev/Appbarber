// client/src/components/Navigation.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, logout, getUser } from '../utils/auth';

const Navigation = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(getUser());

    useEffect(() => {
        // Este listener garante que a barra de navegação atualize
        // se o usuário logar ou deslogar em outra aba.
        const handleStorageChange = () => {
            setUser(getUser());
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

  const handleLogout = () => {
    logout(); // Chamada correta, sem parâmetros
    setUser(null);
    // O redirecionamento já é feito dentro da função logout no auth.js
};

    return (
        <nav className="main-nav">
            <Link to="/" className="nav-logo">BarberTime</Link>
            <div>
                {isLoggedIn() ? (
                    <>
                     {user?.role === 'admin' && (
            <Link to="/admin" className="nav-link admin-link">Admin</Link>
        )}
                        <span className="nav-welcome">Olá, {user?.name || 'Barbeiro'}</span>
                        <Link to="/dashboard" className="nav-link">Painel</Link>
                        <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="nav-link register-link">Seja um Barbeiro</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navigation;
