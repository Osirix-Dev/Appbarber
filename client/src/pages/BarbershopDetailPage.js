// client/src/pages/BarbershopDetailPage.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import './PageContainer.css';

const BarbershopDetailPage = () => {
    const { id } = useParams();
    const [barbershop, setBarbershop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    // ... (outros estados)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const barbershopRes = await api.get(`/barbershops/${id}`);
                setBarbershop(barbershopRes.data);
                if (barbershopRes.data.services && barbershopRes.data.services.length > 0) {
                    setSelectedService(barbershopRes.data.services[0]);
                }

                // Agora busca os funcionários de verdade usando a nova rota
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

    // ... (resto do código do componente, que vamos completar no próximo passo)
    // Por enquanto, vamos apenas listar os funcionários.

    if (loading) return <div className="page-container">Carregando...</div>;
    if (!barbershop) return <div className="page-container">Barbearia não encontrada.</div>;

    return (
        <div className="page-container">
            {/* ... (código do perfil da barbearia) ... */}
            <img src={barbershop.imageUrl} alt={barbershop.name} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }} />
            <h1 style={{ marginTop: '20px' }}>{barbershop.name}</h1>
            <p style={{ fontSize: '1.2rem', color: '#ccc' }}>{barbershop.description}</p>
            <hr style={{ margin: '30px 0', borderColor: '#333' }} />
            {/* ... (código dos serviços) ... */}

            <hr style={{ margin: '30px 0', borderColor: '#333' }} />

            {/* SEÇÃO PARA ESCOLHER O PROFISSIONAL (AGORA COM DADOS REAIS) */}
            <div className="employee-selection-section">
                <h2>{selectedService ? `2. Escolha o Profissional para ${selectedService.name}` : '2. Escolha o Profissional'}</h2>
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
                        <p>Nenhum profissional disponível nesta barbearia.</p>
                    )}
                </div>
            </div>

            {/* Futuramente aqui virá a seleção de data/hora, que dependerá do funcionário */}

        </div>
    );
};

export default BarbershopDetailPage;