// server/routes/appointment.routes.js

const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment.model.js');
// A CORREÇÃO ESTÁ AQUI: o caminho agora é 100% igual ao nome do arquivo.
const Barbershop = require('../models/barbershop.model.js');
const auth = require('../middleware/authMiddleware');

// ROTA PARA CRIAR UM NOVO AGENDAMENTO (PÚBLICA)
router.post('/', async (req, res) => {
    const {
        barbershopId,
        serviceName,
        date,
        time,
        clientName,
        clientPhone
    } = req.body;

    if (!barbershopId || !serviceName || !date || !time || !clientName || !clientPhone) {
        return res.status(400).json({ msg: 'Por favor, preencha todos os campos.' });
    }

    try {
        const barbershop = await Barbershop.findById(barbershopId);
        if (!barbershop) {
            return res.status(404).json({ msg: 'Barbearia não encontrada.' });
        }

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


// ROTA PARA O BARBEIRO BUSCAR SEUS PRÓPRIOS AGENDAMENTOS (PROTEGIDA)
router.get('/my-appointments', auth, async (req, res) => {
    try {
        const barbershop = await Barbershop.findOne({ owner: req.user.id });
        if (!barbershop) {
            return res.json([]); 
        }

        const appointments = await Appointment.find({ barbershopId: barbershop._id }).sort({ date: 1, time: 1 });
        res.json(appointments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});


module.exports = router;