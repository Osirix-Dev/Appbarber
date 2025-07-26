// client/src/pages/RegisterPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import '../PageContainer.css';
import '../App.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setMessage('');
        try {
            await api.post('/users/register', formData);
            alert('Usuário registrado com sucesso! Por favor, faça o login.');
            navigate('/login');
        } catch (err) {
            console.error('Erro no registro:', err);
            setMessage(err.response?.data?.msg || 'Ocorreu um erro no registro.');
        }
    };

    return (
        <div className="page-container">
            <form className="form-container" onSubmit={onSubmit} style={{maxWidth: '400px', margin: 'auto'}}>
                <h2>Crie sua Conta de Barbeiro</h2>
                <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="Nome Completo" required />
                <input type="email" name="email" value={formData.email} onChange={onChange} placeholder="Email" required />
                <input type="password" name="password" value={formData.password} onChange={onChange} placeholder="Senha" required />
                {message && <p className="error-message">{message}</p>}
                <button type="submit" className="button-primary">Registrar</button>
            </form>
        </div>
    );
};

export default RegisterPage;