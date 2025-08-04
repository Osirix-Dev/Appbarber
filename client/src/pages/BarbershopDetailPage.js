// client/src/pages/BarbershopDetailPage.js (VERSÃO FINAL COM FILTRO DE HORÁRIOS)

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
    const [employees, setEmployees] = useState([]);
    
    const [selectedService, setSelectedService] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [availableSlots, setAvailableSlots] = useState([]);
    
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [clientDetails, setClientDetails] = useState({ name: '', phone: '' });
    const [bookingMessage, setBookingMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchData = async () => {
            // ... (código do fetchData continua o mesmo)
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
                setError('Não foi possível carregar os dados.');
            } finally { setLoading(false); }
        };
        fetchData();
    }, [id]);

    // Gera os horários disponíveis, agora filtrando os que já foram agendados
    useEffect(() => {
        const generateAndFilterSlots = async () => {
            if (!barbershop || !selectedService || !selectedEmployee || !selectedDate) {
                setAvailableSlots([]);
                return;
            }
            
            try {
                // 1. Busca os horários já agendados
                const bookedRes = await api.get(`/appointments/booked?employeeId=${selectedEmployee._id}&date=${selectedDate}`);
                const bookedTimes = bookedRes.data; // ex: ["09:30", "11:00"]

                // 2. Gera todos os horários possíveis do dia
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
                    
                    // 3. Adiciona na lista APENAS se o horário NÃO estiver na lista de agendados
                    if (!bookedTimes.includes(slot)) {
                        slots.push(slot);
                    }
                }
                setAvailableSlots(slots);
            } catch (err) {
                console.error("Erro ao gerar horários:", err);
                setAvailableSlots([]);
            }
        };

        generateAndFilterSlots();
    }, [selectedDate, selectedService, selectedEmployee, barbershop]);

    // ... (Handlers: handleServiceSelect, handleEmployeeSelect, handleClientDetailsChange, handleBookingSubmit) ...
    const handleServiceSelect = (service) => { setSelectedService(service); setSelectedEmployee(null); setSelectedSlot(null); };
    const handleEmployeeSelect = (employee) => { setSelectedEmployee(employee); setSelectedSlot(null); };
    const handleClientDetailsChange = (e) => setClientDetails({ ...clientDetails, [e.target.name]: e.target.value });
    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        try {
            const appointmentData = { /* ... */ };
            const res = await api.post('/appointments', appointmentData);
            setBookingMessage({ type: 'success', text: res.data.msg });
            setSelectedSlot(null);
        } catch (err) {
            setBookingMessage({ type: 'error', text: err.response?.data?.msg || 'Erro ao agendar.' });
        }
    };
    
    // ... (JSX do return continua aqui)
};
export default BarbershopDetailPage;