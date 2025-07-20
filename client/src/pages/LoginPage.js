import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Form.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Faz a chamada POST para nossa API de login
            const res = await axios.post('http://localhost:5000/api/users/login', { email, password });

            // Se o login for bem-sucedido, o back-end nos envia um 'token'
            // Vamos guardá-lo no navegador para usar depois
            localStorage.setItem('token', res.data.token);

            alert('Login realizado com sucesso!');
            navigate('/'); // Redireciona o usuário para a página inicial

        } catch (error) {
            console.error('Erro no login:', error.response.data);
            alert(`Erro no login: ${error.response.data.msg}`);
        }
    };

    return (
        <div className="form-container">
            <form className="form-box" onSubmit={handleSubmit}>
                <h2>Login do Barbeiro</h2>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Senha</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="form-button">Entrar</button>
            </form>
        </div>
    );
};

export default LoginPage;