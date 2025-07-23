import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; // Usando nossa instância configurada do Axios
import './PageContainer.css'; // Usando nosso container padrão
import '../App.css'; // Estilos gerais

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // Para mostrar mensagens de erro ao usuário
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Limpa mensagens antigas
        try {
            // Usamos a rota da nossa API
            const res = await api.post('/users/login', { email, password });
            
            // Guarda o token no navegador
            localStorage.setItem('token', res.data.token);

            // Avisa o resto da aplicação que o login mudou (para o Header atualizar)
            window.dispatchEvent(new Event('storage'));

            navigate('/'); // Redireciona o usuário para a página inicial

        } catch (err) {
            // A CORREÇÃO ESTÁ AQUI: usamos a variável 'err' e logamos o objeto inteiro
            console.error('Erro detalhado do login:', err); 
            
            // Mostra uma mensagem de erro amigável para o usuário
            if (err.response) {
                // Se o servidor respondeu com um erro (ex: senha errada)
                setMessage(err.response.data.msg || 'Credenciais inválidas.');
            } else {
                // Se não houve resposta (ex: servidor desligado)
                setMessage('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
            }
        }
    };

    return (
        <div className="page-container">
            <form className="form-container" onSubmit={handleSubmit} style={{maxWidth: '400px', margin: 'auto'}}>
                <h2>Login do Barbeiro</h2>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" required />
                
                {/* Mostra a mensagem de erro, se houver */}
                {message && <p className="error-message">{message}</p>}

                <button type="submit" className="button-primary">Entrar</button>
            </form>
        </div>
    );
};

export default LoginPage;