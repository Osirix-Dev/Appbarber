// client/src/components/ProfileManagement.js

import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import FormularioLocalizacao from './FormularioLocalizacao';

const ProfileManagement = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        imageUrl: '',
        city: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [initialCity, setInitialCity] = useState('');

    // A CORREÇÃO ESTÁ AQUI: O array de dependências vazio [] garante
    // que esta busca de dados só aconteça UMA ÚNICA VEZ.
    useEffect(() => {
        const fetchMyBarbershop = async () => {
            try {
                const res = await api.get('/barbershops/my-barbershop');
                if (res.data) {
                    const { name, description, imageUrl, city } = res.data;
                    setFormData({
                        name: name || '',
                        description: description || '',
                        imageUrl: imageUrl || '',
                        city: city || ''
                    });
                    // Guarda a cidade inicial para passar para o formulário de localização
                    setInitialCity(city || '');
                }
            } catch (error) {
                if (error.response && error.response.status !== 404) {
                    setMessage('Erro ao carregar dados da barbearia.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMyBarbershop();
    }, []); // <--- ESTE ARRAY VAZIO É A CHAVE DA SOLUÇÃO

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleLocationChange = (cidade) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            city: cidade
        }));
    };

    const onSubmit = async e => {
        e.preventDefault();
        setMessage('');
        try {
            await api.post('/barbershops', formData);
            setMessage('Perfil salvo com sucesso!');
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Ocorreu um erro ao salvar o perfil.');
        }
    };

    if (loading) return <p>Carregando perfil...</p>;

    return (
        <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Gerenciar Perfil da Barbearia</h2>
            <form onSubmit={onSubmit} className="form-container" style={{ maxWidth: '600px', margin: 'auto' }}>
                <h3>Dados Públicos da sua Barbearia</h3>
                <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="Nome da Barbearia" required />
                <textarea name="description" value={formData.description} onChange={onChange} placeholder="Uma breve descrição" rows="4" required />
                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={onChange} placeholder="URL da imagem de capa" required />
                
                <FormularioLocalizacao 
                    onLocationChange={handleLocationChange} 
                    initialCity={initialCity} 
                />

                <button type="submit" className="button-primary">Salvar Perfil</button>
                {message && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{message}</p>}
            </form>
        </div>
    );
};

export default ProfileManagement;