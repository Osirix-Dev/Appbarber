// client/src/components/AgendaView.js

import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AgendaView = () => {
    const [allAppointments, setAllAppointments] = useState([]);
    const [employees, setEmployees] = useState([]);
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
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Meus Agendamentos</h2>

            <div className="filter-section">
                <div className="filter-group">
                    <label htmlFor="employee-filter">Profissional:</label>
                    <div className="select-wrapper">
                        <select id="employee-filter" value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)} className="custom-select">
                            <option value="">Todos</option>
                            {employees.map(emp => (<option key={emp._id} value={emp._id}>{emp.name}</option>))}
                        </select>
                    </div>
                </div>

                <div className="filter-group">
                    <label htmlFor="date-filter">Dia:</label>
                    <input type="date" id="date-filter" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="custom-date-input" />
                </div>
                
                <button onClick={() => setSelectedDate('')} className="button-secondary" style={{width: 'auto', height: 'fit-content'}}>
                    Limpar Data
                </button>
            </div>

            {filteredAppointments.length === 0 ? (
                <p style={{ textAlign: 'center' }}>Nenhum agendamento encontrado para esta seleção.</p>
            ) : (
                <div className="appointments-list">
                    {filteredAppointments.map(appt => (
                        <div key={appt._id} className="appointment-card">
                            <p className="appointment-header">
                                {formatDate(appt.date)} às {appt.time}
                            </p>
                            <div className="appointment-details">
                                <p><strong>Cliente:</strong> {appt.clientName}</p>
                                <p><strong>Telefone:</strong> {appt.clientPhone}</p>
                                <p><strong>Serviço:</strong> {appt.serviceName}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AgendaView;