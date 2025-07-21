// server/routes/appointment.routes.js

const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment.model');
const Barbershop = require('../models/Barbershop.model'); // Precisamos verificar a barbearia

// ROTA PARA CRIAR UM NOVO AGENDAMENTO (PÚBLICA)
// POST /api/appointments
router.post('/', async (req, res) => {
    const {
        barbershopId,
        serviceName,
        date,
        time,
        clientName,
        clientPhone
    } = req.body;

    // Validação simples dos dados recebidos
    if (!barbershopId || !serviceName || !date || !time || !clientName || !clientPhone) {
        return res.status(400).json({ msg: 'Por favor, preencha todos os campos.' });
    }

    try {
        // Opcional, mas recomendado: verificar se a barbearia existe
        const barbershop = await Barbershop.findById(barbershopId);
        if (!barbershop) {
            return res.status(404).json({ msg: 'Barbearia não encontrada.' });
        }

        // Futuramente, aqui podemos adicionar a lógica para verificar se o horário já está ocupado

        const newAppointment = new Appointment({
            barbershopId,
            serviceName,
            date,
            time,
            clientName,
            clientPhone
        });

        await newAppointment.save();

        res.status(201).json({ msg: 'Agendamento realizado com sucesso!', appointment: newAppointment });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

module.exports = router;
