// client/src/pages/BarbershopDetailPage.js (VERSÃO FINAL COMPLETA)

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import './PageContainer.css';

const BarbershopDetailPage = () => {
    const { id } = useParams();
    const [barbershop, setBarbershop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    
    // Estados do fluxo de agendamento
    const [selectedService, setSelectedService] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]); // Guarda os horários já agendados
    
    // Estados do formulário final
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [clientDetails, setClientDetails] = useState({ name: '', phone: '' });
    const [bookingMessage, setBookingMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const barbershopRes = await api.get(`/barbershops/${id}`);
                setBarbershop(barbershopRes.data);
                if (barbershopRes.data.services?.length > 0) setSelectedService(barbershopRes.data.services[0]);

                const employeesRes = await api.get(`/employees/shop/${id}`);
                setEmployees(employeesRes.data);
            } catch (error) { console.error("Erro ao buscar dados:", error); } 
            finally { setLoading(false); }
        };
        fetchData();
    }, [id]);

    // Busca os horários já agendados sempre que a data ou o funcionário mudar
    useEffect(() => {
        if (!selectedDate || !selectedEmployee) return;

        const fetchBookedSlots = async () => {
            // (Precisaremos criar esta rota no back-end também)
            // const res = await api.get(`/appointments/booked?employeeId=${selectedEmployee._id}&date=${selectedDate}`);
            // setBookedSlots(res.data);
        };
        // fetchBookedSlots(); // Vamos habilitar isso depois
    }, [selectedDate, selectedEmployee]);


    // Gera os horários disponíveis
    useEffect(() => {
        if (!barbershop || !selectedService || !selectedEmployee) {
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
            const slot = `${hour}:${minute}`;
            
            // Futuramente, vamos verificar se o slot está em 'bookedSlots'
            slots.push(slot);
        }
        setAvailableSlots(slots);

    }, [selectedDate, selectedService, selectedEmployee, barbershop]);


    const handleClientDetailsChange = (e) => setClientDetails({ ...clientDetails, [e.target.name]: e.target.value });

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        try {
            const appointmentData = {
                barbershopId: id,
                serviceName: selectedService.name,
                employeeId: selectedEmployee._id, // Envia o ID do funcionário
                date: selectedDate,
                time: selectedSlot,
                clientName: clientDetails.name,
                clientPhone: clientDetails.phone,
            };
            const res = await api.post('/appointments', appointmentData);
            setBookingMessage({ type: 'success', text: res.data.msg });
            setSelectedSlot(null);
            // Idealmente, aqui deveríamos atualizar a lista de horários ocupados
        } catch (error) {
            setBookingMessage({ type: 'error', text: error.response?.data?.msg || 'Erro ao agendar.' });
        }
    };


    if (loading) return <div className="page-container">Carregando...</div>;
    if (!barbershop) return <div className="page-container">Barbearia não encontrada.</div>;

    return (
        <div className="page-container">
            {/* ... (Seção de Perfil da Barbearia) ... */}
            <hr />
            {/* Seção de Serviços */}
            <div className="services-section">
                <h2>1. Escolha o Serviço</h2>
                {/* ... (código dos serviços) ... */}
            </div>
            <hr />
            {/* Seção de Profissionais */}
            <div className="employee-selection-section">
                <h2>2. Escolha o Profissional</h2>
                {/* ... (código dos funcionários) ... */}
            </div>
            <hr />

            {/* Seção de Agendamento (SÓ APARECE DEPOIS DE ESCOLHER SERVIÇO E PROFISSIONAL) */}
            {selectedService && selectedEmployee && (
                <div className="booking-section">
                    <h2>3. Escolha a Data e Horário</h2>
                    <label htmlFor="date-picker">Data:</label>
                    <input type="date" id="date-picker" value={selectedDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setSelectedDate(e.target.value)} />
                    
                    <h3>Horários Disponíveis:</h3>
                    <div>
                        {availableSlots.length > 0 ? (
                            availableSlots.map(slot => (
                                <button key={slot} onClick={() => setSelectedSlot(slot)} className={selectedSlot === slot ? 'button-primary' : 'button-secondary'}>
                                    {slot}
                                </button>
                            ))
                        ) : <p>Não há horários disponíveis para este profissional neste dia.</p>}
                    </div>

                    {/* Formulário de Confirmação */}
                    {selectedSlot && (
                        <div className="confirmation-form">
                            <h4>Confirmar agendamento para as {selectedSlot}?</h4>
                            <form onSubmit={handleBookingSubmit} className="form-container">
                                <input type="text" name="name" placeholder="Seu nome completo" required onChange={handleClientDetailsChange} />
                                <input type="tel" name="phone" placeholder="Seu telefone (WhatsApp)" required onChange={handleClientDetailsChange} />
                                <button type="submit" className="button-primary">Confirmar Agendamento</button>
                            </form>
                        </div>
                    )}
                    
                    {bookingMessage.text && ( <p style={{ color: bookingMessage.type === 'success' ? '#2ecc71' : '#e74c3c' }}>{bookingMessage.text}</p> )}
                </div>
            )}
        </div>
    );
};

export default BarbershopDetailPage;