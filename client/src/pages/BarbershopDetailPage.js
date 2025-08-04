// client/src/pages/BarbershopDetailPage.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import './PageContainer.css';
import '../App.css';

const BarbershopDetailPage = () => {
    const { id } = useParams();
    const [barbershop, setBarbershop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Estados do fluxo de agendamento
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                // Usamos Promise.all para buscar dados da barbearia e funcionários em paralelo
                const [barbershopRes, employeesRes] = await Promise.all([
                    api.get(`/barbershops/${id}`),
                    api.get(`/employees/shop/${id}`)
                ]);

                setBarbershop(barbershopRes.data);
                setServices(barbershopRes.data.services || []);
                setEmployees(employeesRes.data || []);

                // Pré-seleciona o primeiro serviço, se houver
                if (barbershopRes.data.services?.length > 0) {
                    setSelectedService(barbershopRes.data.services[0]);
                }
                
            } catch (err) {
                console.error("Erro ao buscar dados da página:", err);
                setError('Não foi possível carregar os dados desta barbearia.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);


    if (loading) return <div className="page-container"><p>Carregando...</p></div>;
    if (error) return <div className="page-container"><p className="error-message">{error}</p></div>;
    if (!barbershop) return <div className="page-container"><p>Barbearia não encontrada.</p></div>;

    return (
        <div className="page-container">
            {/* Seção de Perfil da Barbearia */}
            <img src={barbershop.imageUrl} alt={barbershop.name} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }} />
            <h1 style={{ marginTop: '20px' }}>{barbershop.name}</h1>
            <p style={{ fontStyle: 'italic', color: '#ccc' }}>{barbershop.city}</p>
            <p style={{ fontSize: '1.2rem' }}>{barbershop.description}</p>
            <hr style={{ margin: '30px 0', borderColor: '#333' }} />

            {/* Seção de Serviços */}
            <div className="services-section" style={{ marginBottom: '30px' }}>
                <h2>1. Escolha o Serviço</h2>
                {services.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {services.map((service) => (
                            <div 
                                key={service._id} 
                                className={`selectable-item ${selectedService?._id === service._id ? 'selected' : ''}`}
                                onClick={() => setSelectedService(service)}
                            >
                                <span>{service.name} ({service.duration} min)</span>
                                <span>R$ {service.price.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                ) : <p>Nenhum serviço cadastrado.</p>}
            </div>

            {/* Seção de Profissionais (só aparece se um serviço for escolhido) */}
            {selectedService && (
                <div className="employee-selection-section">
                    <h2>2. Escolha o Profissional</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {employees.length > 0 ? (
                            employees.map(emp => (
                                <button 
                                    key={emp._id} 
                                    onClick={() => setSelectedEmployee(emp)}
                                    className={selectedEmployee?._id === emp._id ? 'button-primary' : 'button-secondary'}
                                >
                                    {emp.name}
                                </button>
                            ))
                        ) : (
                            <p>Nenhum profissional cadastrado para esta barbearia.</p>
                        )}
                    </div>
                </div>
            )}
            
            {/* O restante do agendamento (data e hora) virá aqui no próximo passo */}
        </div>
    );
};

export default BarbershopDetailPage;