// client/src/components/ProfileManagement.js

import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const ProfileManagement = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        imageUrl: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    // useEffect para buscar os dados da barbearia do usuário assim que a página carrega
    useEffect(() => {
        const fetchMyBarbershop = async () => {
            try {
                const res = await api.get('/barbershops/my-barbershop');
                if (res.data) {
                    // Se já existe uma barbearia, preenche o formulário com os dados dela
                    setFormData({
                        name: res.data.name,
                        description: res.data.description,
                        imageUrl: res.data.imageUrl
                    });
                }
            } catch (error) {
                // Se der erro 404 (não encontrada), não faz nada, pois o usuário vai criar uma nova.
                if (error.response && error.response.status !== 404) {
                    setMessage('Erro ao carregar dados da barbearia.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMyBarbershop();
    }, []);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setMessage('');
        try {
            // Usamos a rota POST. O back-end vai saber se deve criar uma nova ou atualizar.
            const res = await api.post('/barbershops', formData);
            setMessage('Perfil salvo com sucesso!');
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Ocorreu um erro ao salvar o perfil.');
        }
    };

    if (loading) {
        return <p>Carregando perfil...</p>;
    }

    return (
        <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Gerenciar Perfil da Barbearia</h2>
            <form onSubmit={onSubmit} className="form-container" style={{ maxWidth: '600px', margin: 'auto' }}>
                <h3>Dados Públicos da sua Barbearia</h3>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    placeholder="Nome da Barbearia"
                    required
                />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                    placeholder="Uma breve descrição sobre sua barbearia"
                    rows="4"
                    required
                />
                <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={onChange}
                    placeholder="URL da imagem de capa (ex: https://.../imagem.jpg)"
                    required
                />
                <button type="submit" className="button-primary">Salvar Perfil</button>
                {message && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{message}</p>}
            </form>
        </div>
    );
};

export default ProfileManagement;