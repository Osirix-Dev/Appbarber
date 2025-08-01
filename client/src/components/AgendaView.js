// client/src/components/AgendaView.js

import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AgendaView = () => {
    const [allAppointments, setAllAppointments] = useState([]);
    const [employees, setEmployees] = useState([]);
    
    // Estados para os filtros
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appointmentsRes, employeesRes] = await Promise.all([
                    api.get('/appointments/my-appointments'),
                    api.get('/employees/my-employees')
                ]);
                setAllAppointments(appointmentsRes.data);
                setEmployees(employeesRes.data);
            } catch (err) {
                console.error("Erro ao buscar dados da agenda:", err);
                setError('Não foi possível carregar os dados.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    const filteredAppointments = allAppointments.filter(appt => {
        const employeeMatch = selectedEmployeeId ? appt.employeeId === selectedEmployeeId : true;
        const dateMatch = selectedDate ? appt.date === selectedDate : true;
        return employeeMatch && dateMatch;
    });

    if (loading) return <p>Carregando agendamentos...</p>;
    if (error) return <p style={{ color: '#e74c3c' }}>{error}</p>;

    return (
        <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Meus Agendamentos</h2>

            <div className="filter-section" style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', marginBottom: '30px' }}>
                {/* Filtro por Profissional com o novo invólucro */}
                <div>
                    <label htmlFor="employee-filter" style={{ display: 'block', marginBottom: '5px' }}>Profissional:</label>
                    <div className="select-wrapper">
                        <select 
                            id="employee-filter"
                            value={selectedEmployeeId}
                            onChange={(e) => setSelectedEmployeeId(e.target.value)}
                            className="custom-select"
                        >
                            <option value="">Todos</option>
                            {employees.map(emp => (
                                <option key={emp._id} value={emp._id}>{emp.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Filtro por Dia com o mini calendário */}
                <div>
                    <label htmlFor="date-filter" style={{ display: 'block', marginBottom: '5px' }}>Dia:</label>
                    <input 
                        type="date"
                        id="date-filter"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="custom-date-input"
                    />
                </div>
                
                {/* Botão para limpar o filtro de data */}
                <button onClick={() => setSelectedDate('')} className="button-secondary" style={{width: 'auto', height: 'fit-content'}}>
                    Limpar Data
                </button>
            </div>

            {/* Lista de agendamentos filtrados */}
            {filteredAppointments.length === 0 ? (
                <p>Nenhum agendamento encontrado para esta seleção.</p>
            ) : (
                <div className="appointments-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filteredAppointments.map(appt => (
                        <div key={appt._id} style={{ background: '#222', padding: '15px', borderRadius: '8px' }}>
                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>
                                Data: {formatDate(appt.date)} às {appt.time}
                            </p>
                            <p style={{ margin: '5px 0' }}>Cliente: {appt.clientName}</p>
                            <p style={{ margin: '5px 0' }}>Telefone: {appt.clientPhone}</p>
                            <p style={{ margin: '5px 0' }}>Serviço: {appt.serviceName}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AgendaView;