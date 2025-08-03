// client/src/components/ServicesManagement.js

import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const ServicesManagement = () => {
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({ name: '', price: '', duration: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // Função para buscar os serviços
    const fetchServices = async () => {
        try {
            const res = await api.get('/barbershops/my-barbershop');
            setServices(res.data.services || []);
        } catch (err) {
            console.error("Erro ao buscar serviços:", err);
            setError('Não foi possível carregar os serviços.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/barbershops/my-barbershop/services', formData);
            setServices(res.data);
            setFormData({ name: '', price: '', duration: '' });
        } catch (err) {
            setError(err.response?.data?.msg || 'Ocorreu um erro ao adicionar o serviço.');
        }
    };

    // NOVA FUNÇÃO PARA DELETAR
    const handleDelete = async (serviceId) => {
        if (window.confirm('Tem certeza que deseja remover este serviço?')) {
            try {
                const res = await api.delete(`/barbershops/my-barbershop/services/${serviceId}`);
                setServices(res.data.services); // Atualiza a lista com a resposta da API
            } catch (err) {
                setError(err.response?.data?.msg || 'Erro ao remover serviço.');
            }
        }
    };

    if (loading) return <p>Carregando serviços...</p>;

    return (
        <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Gerenciar Serviços</h2>
            
            <form onSubmit={onSubmit} className="form-container" style={{ maxWidth: '600px', margin: 'auto' }}>
                <h3>Adicionar Novo Serviço</h3>
                <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="Nome (ex: Corte Tesoura)" required />
                <input type="number" name="price" value={formData.price} onChange={onChange} placeholder="Preço (ex: 40)" required />
                <input type="number" name="duration" value={formData.duration} onChange={onChange} placeholder="Duração em minutos (ex: 30)" required />
                <button type="submit" className="button-primary">Adicionar Serviço</button>
                {error && <p className="error-message">{error}</p>}
            </form>

            <hr style={{ margin: '40px 0', borderColor: '#333' }} />

            <div className="services-list">
                <h3>Serviços Cadastrados</h3>
                {services.length === 0 ? (
                    <p>Nenhum serviço cadastrado ainda.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {services.map((service) => (
                            <li key={service._id} style={{ background: '#222', padding: '15px', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontWeight: 'bold' }}>{service.name}</span><br />
                                    <span style={{ color: '#aaa' }}>R$ {service.price.toFixed(2)} - {service.duration} min</span>
                                </div>
                                {/* BOTÃO DE REMOVER ADICIONADO AQUI */}
                                <button onClick={() => handleDelete(service._id)} style={{ background: '#c0392b', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>
                                    Remover
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ServicesManagement;