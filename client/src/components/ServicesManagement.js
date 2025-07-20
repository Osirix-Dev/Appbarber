// client/src/components/ServicesManagement.js

import React, { useState, useEffect } from 'react';
// Caminho CORRETO para o axiosConfig
import api from '../api/axiosConfig'; 
// Caminho CORRETO para o PageContainer.css
import '../pages/PageContainer.css'; 

const ServicesManagement = () => {
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({ name: '', price: '', duration: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // Busca os serviços atuais da barbearia
    useEffect(() => {
        const fetchServices = async () => {
            try {
                // Para este componente funcionar, você precisa estar logado com um barbeiro
                // que tenha uma barbearia cadastrada.
                const res = await api.get('/barbershops/my-barbershop');
                setServices(res.data.services || []);
            } catch (err) {
                console.error("Erro ao buscar serviços:", err);
                setError('Não foi possível carregar os serviços. Você já criou o perfil da sua barbearia?');
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/barbershops/my-barbershop/services', formData);
            setServices(res.data); // A API retorna a nova lista de serviços
            setFormData({ name: '', price: '', duration: '' }); // Limpa o formulário
        } catch (err) {
            setError(err.response?.data?.msg || 'Ocorreu um erro ao adicionar o serviço.');
            console.error(err);
        }
    };

    if (loading) {
        return <p>Carregando serviços...</p>
    }

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
                {services.length === 0 && !error ? (
                    <p>Nenhum serviço cadastrado ainda.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {services.map((service, index) => (
                            <li key={index} style={{ background: '#222', padding: '15px', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                <span>{service.name}</span>
                                <span>R$ {service.price.toFixed(2)}</span>
                                <span>{service.duration} min</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ServicesManagement;