// client/src/components/AvailabilityManagement.js

import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const daysOfWeek = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo',
};

const AvailabilityManagement = () => {
    const [hours, setHours] = useState({});
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchHours = async () => {
            try {
                const res = await api.get('/barbershops/my-barbershop');
                if (res.data && res.data.operatingHours) {
                    // Inicializa o estado com um objeto completo para todos os dias
                    const initialHours = {};
                    for (const dayKey in daysOfWeek) {
                        initialHours[dayKey] = res.data.operatingHours.get(dayKey) || { isOpen: false, startTime: '09:00', endTime: '18:00' };
                    }
                    setHours(initialHours);
                }
            } catch (error) {
                console.error("Erro ao buscar horários", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHours();
    }, []);

    const handleCheckboxChange = (day) => {
        setHours(prevHours => ({
            ...prevHours,
            [day]: {
                ...prevHours[day],
                isOpen: !prevHours[day]?.isOpen
            }
        }));
    };

    const handleTimeChange = (day, field, value) => {
        setHours(prevHours => ({
            ...prevHours,
            [day]: {
                ...prevHours[day],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const res = await api.put('/barbershops/my-barbershop/hours', { operatingHours: hours });
            setMessage(res.data.msg);
        } catch (error) {
            setMessage('Falha ao salvar. Tente novamente.');
            console.error('Erro ao salvar horários:', error);
        }
    };
    
    if (loading) return <p>Carregando horários...</p>;

    return (
        <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Meus Horários de Funcionamento</h2>
            {/* O formulário agora tem o display flex e a direção de coluna */}
            <form 
                onSubmit={handleSubmit} 
                className="form-container" 
                style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxWidth: '700px', margin: 'auto' }}
            >
                {Object.entries(daysOfWeek).map(([dayKey, dayName]) => {
                    const dayConfig = hours[dayKey] || { isOpen: false, startTime: '09:00', endTime: '18:00' };
                    return (
                        <div key={dayKey} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #333' }}>
                            <div style={{ minWidth: '150px' }}>
                                <input
                                    type="checkbox"
                                    id={dayKey}
                                    checked={dayConfig.isOpen}
                                    onChange={() => handleCheckboxChange(dayKey)}
                                />
                                <label htmlFor={dayKey} style={{ marginLeft: '10px', fontSize: '1.1rem' }}>{dayName}</label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span>Das</span>
                                <input
                                    type="time"
                                    value={dayConfig.startTime}
                                    disabled={!dayConfig.isOpen}
                                    onChange={(e) => handleTimeChange(dayKey, 'startTime', e.target.value)}
                                    className="time-input"
                                />
                                <span>às</span>
                                <input
                                    type="time"
                                    value={dayConfig.endTime}
                                    disabled={!dayConfig.isOpen}
                                    onChange={(e) => handleTimeChange(dayKey, 'endTime', e.target.value)}
                                    className="time-input"
                                />
                            </div>
                        </div>
                    );
                })}
                <button type="submit" className="button-primary" style={{ marginTop: '30px', width: '100%' }}>
                    Salvar Horários
                </button>
                {message && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{message}</p>}
            </form>
        </div>
    );
};

export default AvailabilityManagement;