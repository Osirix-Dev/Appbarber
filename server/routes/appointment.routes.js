// server/routes/appointment.routes.js

const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment.model.js');
const Barbershop = require('../models/barbershop.model.js');
const auth = require('../middleware/authMiddleware');

// ROTA PARA CRIAR UM NOVO AGENDAMENTO
router.post('/', async (req, res) => {
    const { barbershopId, serviceName, employeeId, date, time, clientName, clientPhone } = req.body;
    if (!barbershopId || !serviceName || !employeeId || !date || !time || !clientName || !clientPhone) {
        return res.status(400).json({ msg: 'Todos os campos são obrigatórios.' });
    }
    try {
        const existingAppointment = await Appointment.findOne({ employeeId, date, time });
        if (existingAppointment) {
            return res.status(409).json({ msg: 'Este horário não está mais disponível. Por favor, escolha outro.' });
        }
        const newAppointment = new Appointment({
            barbershopId, serviceName, employeeId, date, time, clientName, clientPhone
        });
        await newAppointment.save();
        res.status(201).json({ msg: 'Agendamento realizado com sucesso!', appointment: newAppointment });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

// ROTA PARA O BARBEIRO BUSCAR SEUS PRÓPRIOS AGENDAMENTOS
router.get('/my-appointments', auth, async (req, res) => {
    try {
        const barbershop = await Barbershop.findOne({ owner: req.user.id });
        if (!barbershop) return res.json([]);
        const appointments = await Appointment.find({ barbershopId: barbershop._id }).sort({ date: 1, time: 1 });
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});
// ROTA PÚBLICA PARA BUSCAR HORÁRIOS JÁ AGENDADOS
// GET /api/appointments/booked?employeeId=...&date=...
router.get('/booked', async (req, res) => {
    const { employeeId, date } = req.query;

    if (!employeeId || !date) {
        return res.status(400).json({ msg: 'ID do funcionário e data são obrigatórios.' });
    }

    try {
        const appointments = await Appointment.find({
            employeeId: employeeId,
            date: date
        });

        // Retorna apenas a lista de horários (ex: ["09:30", "10:00"])
        const bookedTimes = appointments.map(appt => appt.time);
        res.json(bookedTimes);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

module.exports = router;