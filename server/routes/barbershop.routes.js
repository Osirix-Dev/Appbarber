// server/routes/barbershop.routes.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
// A CORREÇÃO ESTÁ AQUI: o caminho agora é 100% igual ao nome do arquivo.
const Barbershop = require('../models/barbershop.model.js');

// Rota para CRIAR ou ATUALIZAR o perfil da barbearia
router.post('/', auth, async (req, res) => {
    // ... (o resto do seu código aqui dentro não precisa mudar)
    const { name, address, phone, services, availability } = req.body;
    try {
        let barbershop = await Barbershop.findOne({ owner: req.user.id });
        if (barbershop) {
            // Atualiza
            barbershop = await Barbershop.findOneAndUpdate(
                { owner: req.user.id },
                { $set: { name, address, phone, services, availability } },
                { new: true }
            );
            return res.json(barbershop);
        }
        // Cria
        barbershop = new Barbershop({
            owner: req.user.id,
            name,
            address,
            phone,
            services,
            availability
        });
        await barbershop.save();
        res.json(barbershop);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Rota para PEGAR o perfil da barbearia do usuário logado
router.get('/me', auth, async (req, res) => {
    // ... (o resto do seu código aqui dentro não precisa mudar)
    try {
        const barbershop = await Barbershop.findOne({ owner: req.user.id });
        if (!barbershop) {
            return res.status(404).json({ msg: 'Barbearia não encontrada' });
        }
        res.json(barbershop);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Rota para PEGAR TODOS os perfis de barbearia (PÚBLICA)
router.get('/', async (req, res) => {
    // ... (o resto do seu código aqui dentro não precisa mudar)
    try {
        const barbershops = await Barbershop.find();
        res.json(barbershops);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

// Rota para PEGAR UMA barbearia pelo ID (PÚBLICA)
router.get('/:id', async (req, res) => {
    // ... (o resto do seu código aqui dentro não precisa mudar)
    try {
        const barbershop = await Barbershop.findById(req.params.id);
        if (!barbershop) {
            return res.status(404).json({ msg: 'Barbearia não encontrada' });
        }
        res.json(barbershop);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Barbearia não encontrada' });
        }
        res.status(500).send('Erro no Servidor');
    }
});

module.exports = router;