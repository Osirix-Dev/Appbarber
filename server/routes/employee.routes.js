// server/routes/employee.routes.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Employee = require('../models/employee.model.js');
const Barbershop = require('../models/barbershop.model.js');

// ROTA PARA CADASTRAR UM NOVO FUNCIONÁRIO (PROTEGIDA)
// POST /api/employees
router.post('/', auth, async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ msg: 'O nome do funcionário é obrigatório.' });
    }

    try {
        const barbershop = await Barbershop.findOne({ owner: req.user.id });
        if (!barbershop) {
            return res.status(404).json({ msg: 'Barbearia não encontrada.' });
        }

        const newEmployee = new Employee({
            name,
            barbershopId: barbershop._id,
            ownerId: req.user.id
        });

        await newEmployee.save();
        res.status(201).json(newEmployee);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

// ROTA PARA BUSCAR OS FUNCIONÁRIOS DA BARBEARIA (PROTEGIDA)
// GET /api/employees/my-employees
router.get('/my-employees', auth, async (req, res) => {
    try {
        const barbershop = await Barbershop.findOne({ owner: req.user.id });
        if (!barbershop) {
            return res.json([]); // Retorna lista vazia se não há barbearia
        }

        const employees = await Employee.find({ barbershopId: barbershop._id });
        res.json(employees);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

// ROTA PARA DELETAR UM FUNCIONÁRIO (PROTEGIDA)
// DELETE /api/employees/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ msg: 'Funcionário não encontrado.' });
        }
        // Garante que o usuário logado é o dono do funcionário que está tentando deletar
        if (employee.ownerId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Não autorizado.' });
        }

        await employee.remove();
        res.json({ msg: 'Funcionário removido com sucesso.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

module.exports = router;