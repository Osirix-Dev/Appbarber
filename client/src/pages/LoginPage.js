// client/src/pages/LoginPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import '../PageContainer.css';
import '../App.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setMessage('');
        try {
            const res = await api.post('/users/login', formData);
            localStorage.setItem('token', res.data.token);
            window.dispatchEvent(new Event('storage'));
            navigate('/');
        } catch (err) {
            console.error('Erro detalhado do login:', err);
            setMessage(err.response?.data?.msg || 'Não foi possível conectar ao servidor.');
        }
    };

    return (
        <div className="page-container">
            <form className="form-container" onSubmit={onSubmit} style={{maxWidth: '400px', margin: 'auto'}}>
                <h2>Login</h2>
                <input type="email" name="email" value={formData.email} onChange={onChange} placeholder="Email" required />
                <input type="password" name="password" value={formData.password} onChange={onChange} placeholder="Senha" required />
                {message && <p className="error-message">{message}</p>}
                <button type="submit" className="button-primary">Entrar</button>
            </form>
        </div>
    );
};

export default LoginPage;