// client/src/pages/BarbershopDetailPage.js (VERSÃO FINAL COMPLETA)

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
    const [selectedService, setSelectedService] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [availableSlots, setAvailableSlots] = useState([]);
    
    // Estados do formulário final
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [clientDetails, setClientDetails] = useState({ name: '', phone: '' });
    const [bookingMessage, setBookingMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [barbershopRes, employeesRes] = await Promise.all([
                    api.get(`/barbershops/${id}`),
                    api.get(`/employees/shop/${id}`)
                ]);

                setBarbershop(barbershopRes.data);
                if (barbershopRes.data.services?.length > 0) setSelectedService(barbershopRes.data.services[0]);
                setEmployees(employeesRes.data || []);
                
            } catch (err) {
                console.error("Erro ao buscar dados:", err);
                setError('Não foi possível carregar os dados desta barbearia.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Gera os horários disponíveis sempre que as seleções mudam
    useEffect(() => {
        if (!barbershop || !selectedService || !selectedEmployee || !selectedDate) {
            setAvailableSlots([]);
            return;
        }
        
        const date = new Date(`${selectedDate}T00:00:00`);
        const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
        const dayHours = barbershop.operatingHours[dayOfWeek];

        if (!dayHours || !dayHours.isOpen) { setAvailableSlots([]); return; }

        const slots = [];
        const serviceDuration = selectedService.duration;
        const [startHour, startMinute] = dayHours.startTime.split(':').map(Number);
        const startTimeInMinutes = startHour * 60 + startMinute;
        const [endHour, endMinute] = dayHours.endTime.split(':').map(Number);
        const endTimeInMinutes = endHour * 60 + endMinute;

        for (let time = startTimeInMinutes; time <= endTimeInMinutes - serviceDuration; time += serviceDuration) {
            const hour = Math.floor(time / 60).toString().padStart(2, '0');
            const minute = (time % 60).toString().padStart(2, '0');
            slots.push(`${hour}:${minute}`);
        }
        setAvailableSlots(slots);

    }, [selectedDate, selectedService, selectedEmployee, barbershop]);

    // Limpa seleções se o passo anterior mudar
    const handleServiceSelect = (service) => {
        setSelectedService(service);
        setSelectedEmployee(null);
        setSelectedSlot(null);
        setAvailableSlots([]);
    };
    const handleEmployeeSelect = (employee) => {
        setSelectedEmployee(employee);
        setSelectedSlot(null);
    };

    const handleClientDetailsChange = (e) => setClientDetails({ ...clientDetails, [e.target.name]: e.target.value });

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        try {
            const appointmentData = {
                barbershopId: id,
                serviceName: selectedService.name,
                employeeId: selectedEmployee._id,
                date: selectedDate,
                time: selectedSlot,
                clientName: clientDetails.name,
                clientPhone: clientDetails.phone,
            };
            const res = await api.post('/appointments', appointmentData);
            setBookingMessage({ type: 'success', text: res.data.msg });
            setSelectedSlot(null);
        } catch (err) {
            setBookingMessage({ type: 'error', text: err.response?.data?.msg || 'Erro ao agendar.' });
        }
    };

    if (loading) return <div className="page-container"><p>Carregando...</p></div>;
    if (error) return <div className="page-container"><p className="error-message">{error}</p></div>;
    if (!barbershop) return <div className="page-container"><p>Barbearia não encontrada.</p></div>;

    return (
        <div className="page-container">
            {/* ... (código do perfil da barbearia) ... */}
            <img src={barbershop.imageUrl} alt={barbershop.name} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }} />
            <h1 style={{ marginTop: '20px' }}>{barbershop.name}</h1>
            <p style={{ fontStyle: 'italic', color: '#ccc' }}>{barbershop.city}</p>
            <p style={{ fontSize: '1.2rem' }}>{barbershop.description}</p>
            <hr style={{ margin: '30px 0', borderColor: '#333' }} />

            {/* Passo 1: Serviços */}
            <div className="services-section" style={{ marginBottom: '30px' }}>
                <h2>1. Escolha o Serviço</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {barbershop.services?.map((service) => (
                        <div key={service._id} className={`selectable-item ${selectedService?._id === service._id ? 'selected' : ''}`} onClick={() => handleServiceSelect(service)}>
                            <span>{service.name} ({service.duration} min)</span>
                            <span>R$ {service.price.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Passo 2: Profissionais (só aparece se um serviço for escolhido) */}
            {selectedService && (
                <div className="employee-selection-section" style={{ marginBottom: '30px' }}>
                    <h2>2. Escolha o Profissional</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {employees.map(emp => (
                            <button key={emp._id} onClick={() => handleEmployeeSelect(emp)} className={selectedEmployee?._id === emp._id ? 'button-primary' : 'button-secondary'}>
                                {emp.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Passo 3 e 4: Data, Horário e Confirmação (só aparece depois dos passos 1 e 2) */}
            {selectedService && selectedEmployee && (
                <div className="booking-section">
                    <h2>3. Escolha a Data e Horário</h2>
                    <input type="date" value={selectedDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setSelectedDate(e.target.value)} style={{ display: 'block', margin: '10px 0 20px', padding: '10px' }}/>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {availableSlots.length > 0 ? (
                            availableSlots.map(slot => (
                                <button key={slot} onClick={() => setSelectedSlot(slot)} className={selectedSlot === slot ? 'button-primary' : 'button-secondary'}>
                                    {slot}
                                </button>
                            ))
                        ) : <p>Não há horários disponíveis para este profissional neste dia.</p>}
                    </div>

                    {selectedSlot && (
                        <div className="confirmation-form" style={{ marginTop: '30px' }}>
                            <h4>Confirmar agendamento com {selectedEmployee.name} para as {selectedSlot}?</h4>
                            <form onSubmit={handleBookingSubmit} className="form-container">
                                <input type="text" name="name" placeholder="Seu nome completo" required onChange={handleClientDetailsChange} />
                                <input type="tel" name="phone" placeholder="Seu telefone" required onChange={handleClientDetailsChange} />
                                <button type="submit" className="button-primary">Confirmar Agendamento</button>
                            </form>
                        </div>
                    )}
                    
                    {bookingMessage.text && ( <p style={{ color: bookingMessage.type === 'success' ? '#2ecc71' : '#e74c3c', textAlign: 'center', marginTop: '20px' }}>{bookingMessage.text}</p> )}
                </div>
            )}
        </div>
    );
};

export default BarbershopDetailPage;