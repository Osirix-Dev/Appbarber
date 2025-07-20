import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionar o usuário
import axios from 'axios'; // Importamos o Axios
import './Form.css';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook para controlar a navegação

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o recarregamento padrão do formulário

        const newUser = { name, email, password };

        try {
            // Faz a chamada POST para nossa API de registro
            await axios.post('http://localhost:5000/api/users/register', newUser);

            // Se a chamada for bem-sucedida...
            alert('Usuário registrado com sucesso! Por favor, faça o login.');
            navigate('/login'); // Redireciona o usuário para a página de login

        } catch (error) {
            // Se a API retornar um erro...
            console.error('Erro no registro:', error.response.data);
            // Mostra a mensagem de erro que vem do nosso back-end
            alert(`Erro no registro: ${error.response.data.msg}`);
        }
    };

    return (
        <div className="form-container">
            <form className="form-box" onSubmit={handleSubmit}>
                <h2>Crie sua Conta de Barbeiro</h2>
                <div className="input-group">
                    <label htmlFor="name">Nome Completo</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Senha</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="form-button">Registrar</button>
            </form>
        </div>
    );
};

export default RegisterPage;