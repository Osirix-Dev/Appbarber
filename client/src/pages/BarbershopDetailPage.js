// client/src/pages/BarbershopDetailPage.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import './PageContainer.css';

const BarbershopDetailPage = () => {
    const { id } = useParams();
    const [barbershop, setBarbershop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(null);
    
    // Estados para a nova funcionalidade
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // (Vamos reintroduzir os outros estados de agendamento no próximo passo)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Busca os detalhes da barbearia
                const barbershopRes = await api.get(`/barbershops/${id}`);
                setBarbershop(barbershopRes.data);
                if (barbershopRes.data.services && barbershopRes.data.services.length > 0) {
                    setSelectedService(barbershopRes.data.services[0]);
                }

                // Busca os funcionários desta barbearia usando a nova rota pública
                const employeesRes = await api.get(`/employees/shop/${id}`);
                setEmployees(employeesRes.data);
                
            } catch (error) {
                console.error("Erro ao buscar dados da página:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);


    if (loading) return <div className="page-container">Carregando...</div>;
    if (!barbershop) return <div className="page-container">Barbearia não encontrada.</div>;

    return (
        <div className="page-container">
            {/* Seção de Perfil da Barbearia */}
            <img src={barbershop.imageUrl} alt={barbershop.name} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }} />
            <h1 style={{ marginTop: '20px' }}>{barbershop.name}</h1>
            <p style={{ fontStyle: 'italic', color: '#ccc' }}>{barbershop.city}</p>
            <p style={{ fontSize: '1.2rem' }}>{barbershop.description}</p>
            <hr style={{ margin: '30px 0', borderColor: '#333' }} />

            {/* Seção de Serviços */}
            <div className="services-section">
                <h2>1. Escolha o Serviço</h2>
                {barbershop.services && barbershop.services.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {barbershop.services.map((service) => (
                            <li 
                                key={service._id} 
                                style={{ background: selectedService?._id === service._id ? '#e50914' : '#222', padding: '15px', borderRadius: '8px', marginBottom: '10px', cursor: 'pointer' }} 
                                onClick={() => setSelectedService(service)}
                            >
                                {service.name} - R$ {service.price.toFixed(2)} ({service.duration} min)
                            </li>
                        ))}
                    </ul>
                ) : <p>Nenhum serviço cadastrado.</p>}
            </div>

            <hr style={{ margin: '30px 0', borderColor: '#333' }} />

            {/* NOVA SEÇÃO PARA ESCOLHER O PROFISSIONAL */}
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

            {/* O restante do agendamento (data e hora) virá aqui no próximo passo */}
        </div>
    );
};

export default BarbershopDetailPage;