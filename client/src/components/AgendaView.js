// client/src/components/AgendaView.js

import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AgendaView = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await api.get('/appointments/my-appointments');
                setAppointments(res.data);
            } catch (err) {
                console.error("Erro ao buscar agendamentos:", err);
                setError('Não foi possível carregar os agendamentos.');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []); // O array vazio [] faz com que isso rode apenas uma vez, quando o componente é montado

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    if (loading) {
        return <p>Carregando agendamentos...</p>;
    }

    if (error) {
        return <p style={{ color: '#e74c3c' }}>{error}</p>;
    }

    return (
        <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Meus Agendamentos</h2>
            {appointments.length === 0 ? (
                <p>Nenhum agendamento encontrado.</p>
            ) : (
                <div className="appointments-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {appointments.map(appt => (
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