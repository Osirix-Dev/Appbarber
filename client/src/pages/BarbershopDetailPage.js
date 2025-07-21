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

    // --- NOVOS ESTADOS PARA O AGENDAMENTO FINAL ---
    const [selectedSlot, setSelectedSlot] = useState(null); // Guarda o horário clicado
    const [clientDetails, setClientDetails] = useState({ name: '', phone: '' }); // Guarda os dados do cliente
    const [bookingMessage, setBookingMessage] = useState({ type: '', text: '' }); // Guarda a mensagem de sucesso/erro

    useEffect(() => {
        // ... (código do useEffect que busca a barbearia - sem alterações)
        const fetchBarbershop = async () => {
            try {
                const res = await api.get(`/barbershops/${id}`);
                setBarbershop(res.data);
                if (res.data.services && res.data.services.length > 0) {
                    setSelectedService(res.data.services[0]);
                }
            } catch (error) {
                console.error("Erro ao buscar detalhes da barbearia:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBarbershop();
    }, [id]);

    useEffect(() => {
        // ... (código do useEffect que gera os horários - sem alterações)
        if (!barbershop || !selectedService || !barbershop.operatingHours) return;
        const generateTimeSlots = () => {
            const date = new Date(`${selectedDate}T00:00:00`);
            const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
            const dayHours = barbershop.operatingHours[dayOfWeek];
            if (!dayHours || !dayHours.isOpen) {
                setAvailableSlots([]);
                return;
            }
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
        };
        generateTimeSlots();
    }, [selectedDate, selectedService, barbershop]);

    // --- NOVAS FUNÇÕES ---
    const handleSlotClick = (slot) => {
        setSelectedSlot(slot); // Guarda o horário que o cliente clicou
        setBookingMessage({ type: '', text: '' }); // Limpa mensagens antigas
    };

    const handleClientDetailsChange = (e) => {
        setClientDetails({
            ...clientDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        try {
            const appointmentData = {
                barbershopId: id,
                serviceName: selectedService.name,
                date: selectedDate,
                time: selectedSlot,
                clientName: clientDetails.name,
                clientPhone: clientDetails.phone,
            };
            const res = await api.post('/appointments', appointmentData);
            setBookingMessage({ type: 'success', text: res.data.msg });
            setSelectedSlot(null); // Esconde o formulário após o sucesso
        } catch (error) {
            setBookingMessage({ type: 'error', text: error.response?.data?.msg || 'Erro ao agendar.' });
        }
    };

    if (loading) return <div className="page-container">Carregando...</div>;
    if (!barbershop) return <div className="page-container">Barbearia não encontrada.</div>;

    return (
        <div className="page-container">
            {/* ... (Seção de Perfil e Serviços - sem alterações) ... */}
            <img src={barbershop.imageUrl} alt={barbershop.name} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }} />
            <h1 style={{ marginTop: '20px' }}>{barbershop.name}</h1>
            <p style={{ fontSize: '1.2rem', color: '#ccc' }}>{barbershop.description}</p>
            <hr style={{ margin: '30px 0', borderColor: '#333' }} />
            <div className="services-section">
                <h2>Nossos Serviços</h2>
                {barbershop.services && barbershop.services.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {barbershop.services.map((service, index) => (
                            <li key={index} style={{ background: selectedService?._id === service._id ? '#e50914' : '#222', padding: '15px', borderRadius: '8px', marginBottom: '10px', cursor: 'pointer' }} onClick={() => setSelectedService(service)}>
                                {service.name} - R$ {service.price.toFixed(2)} ({service.duration} min)
                            </li>
                        ))}
                    </ul>
                ) : <p>Nenhum serviço cadastrado.</p>}
            </div>
            <hr style={{ margin: '30px 0', borderColor: '#333' }} />

            {/* --- SEÇÃO DE AGENDAMENTO ATUALIZADA --- */}
            <div className="booking-section">
                <h2>Agende seu Horário</h2>
                <p>Serviço selecionado: <strong>{selectedService?.name || 'Nenhum'}</strong></p>
                <label htmlFor="date-picker">Escolha uma data:</label>
                <input type="date" id="date-picker" value={selectedDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setSelectedDate(e.target.value)} style={{ display: 'block', margin: '10px 0 20px', padding: '10px' }}/>
                <h3>Horários Disponíveis:</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {availableSlots.length > 0 ? (
                        availableSlots.map(slot => (
                            <button key={slot} onClick={() => handleSlotClick(slot)} className={selectedSlot === slot ? 'button-primary' : 'button-secondary'}>
                                {slot}
                            </button>
                        ))
                    ) : <p>Não há horários disponíveis para este dia.</p>}
                </div>

                {/* --- NOVO FORMULÁRIO DE CONFIRMAÇÃO --- */}
                {/* Este formulário só aparece quando um horário é clicado */}
                {selectedSlot && (
                    <div className="confirmation-form" style={{ marginTop: '30px', padding: '20px', background: '#222', borderRadius: '8px' }}>
                        <h4>Confirmar agendamento para as {selectedSlot}?</h4>
                        <form onSubmit={handleBookingSubmit} className="form-container">
                            <input type="text" name="name" placeholder="Seu nome completo" required onChange={handleClientDetailsChange} />
                            <input type="tel" name="phone" placeholder="Seu telefone (WhatsApp)" required onChange={handleClientDetailsChange} />
                            <button type="submit" className="button-primary">Confirmar Agendamento</button>
                        </form>
                    </div>
                )}
                
                {/* --- NOVA MENSAGEM DE STATUS --- */}
                {bookingMessage.text && (
                    <p style={{ textAlign: 'center', marginTop: '20px', color: bookingMessage.type === 'success' ? '#2ecc71' : '#e74c3c' }}>
                        {bookingMessage.text}
                    </p>
                )}
            </div>
        </div>
    );
};

export default BarbershopDetailPage;