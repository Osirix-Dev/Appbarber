// server/routes/appointment.routes.js

// (as importações no topo do arquivo continuam as mesmas)

// ROTA PARA CRIAR UM NOVO AGENDAMENTO (AGORA COM VERIFICAÇÃO DE CONFLITO)
router.post('/', async (req, res) => {
    const { barbershopId, serviceName, employeeId, date, time, clientName, clientPhone } = req.body;

    if (!barbershopId || !serviceName || !employeeId || !date || !time || !clientName || !clientPhone) {
        return res.status(400).json({ msg: 'Todos os campos são obrigatórios.' });
    }

    try {
        // VERIFICA SE O HORÁRIO JÁ ESTÁ AGENDADO PARA AQUELE FUNCIONÁRIO NAQUELA DATA
        const existingAppointment = await Appointment.findOne({
            employeeId: employeeId,
            date: date,
            time: time
        });

        if (existingAppointment) {
            return res.status(409).json({ msg: 'Este horário não está mais disponível. Por favor, escolha outro.' }); // 409 Conflict
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