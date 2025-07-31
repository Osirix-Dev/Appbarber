// client/src/pages/BarbershopDetailPage.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axiosConfig'; 
import '../PageContainer.css';

const BarbershopDetailPage = () => {
    const { id } = useParams();
    const [barbershop, setBarbershop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [bookingMessage, setBookingMessage] = useState({ type: '', text: '' });
    
    // --- NOVOS ESTADOS PARA FUNCIONÁRIOS ---
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [clientDetails, setClientDetails] = useState({ name: '', phone: '' });
    const [selectedSlot, setSelectedSlot] = useState(null);

    // Este useEffect agora busca TANTO a barbearia QUANTO os funcionários
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Busca os detalhes da barbearia
                const barbershopRes = await api.get(`/barbershops/${id}`);
                setBarbershop(barbershopRes.data);
                if (barbershopRes.data.services && barbershopRes.data.services.length > 0) {
                    setSelectedService(barbershopRes.data.services[0]);
                }

                // Busca os funcionários desta barbearia
                // Precisamos de uma nova rota para isso, que vamos criar no Passo 2
                // const employeesRes = await api.get(`/employees/by-shop/${id}`);
                // setEmployees(employeesRes.data);

            } catch (error) {
                console.error("Erro ao buscar dados da página:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Lógica para gerar horários (vamos ajustar depois para considerar o funcionário)
    useEffect(() => {
        // ... (lógica existente) ...
    }, [selectedDate, selectedService, barbershop]);

    // ... (funções de handle existentes) ...

    if (loading) return <div className="page-container">Carregando...</div>;
    if (!barbershop) return <div className="page-container">Barbearia não encontrada.</div>;

    return (
        <div className="page-container">
            {/* ... (código do perfil da barbearia) ... */}
            
            <hr style={{ margin: '30px 0', borderColor: '#333' }} />

            {/* --- NOVA SEÇÃO PARA ESCOLHER O PROFISSIONAL --- */}
            <div className="employee-selection-section">
                <h2>Escolha o Profissional</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {/* Aqui vamos listar os funcionários. Por enquanto, dados de exemplo */}
                    <button className="button-secondary">Barbeiro 1 (Exemplo)</button>
                    <button className="button-secondary">Barbeiro 2 (Exemplo)</button>
                </div>
            </div>

            {/* ... (resto do código de agendamento) ... */}
        </div>
    );
};

export default BarbershopDetailPage;