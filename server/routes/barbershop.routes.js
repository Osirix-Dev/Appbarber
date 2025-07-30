// server/routes/barbershop.routes.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Barbershop = require('../models/barbershop.model.js');

// =======================================================
// ROTAS DO BARBEIRO (PROTEGIDAS)
// =======================================================

// ROTA PARA CRIAR OU ATUALIZAR O PERFIL DA BARBEARIA
router.post('/', auth, async (req, res) => {
    const { name, description, imageUrl, city } = req.body;
    if (!name || !description || !imageUrl || !city) {
        return res.status(400).json({ msg: 'Por favor, preencha todos os campos.' });
    }
    try {
        const barbershopFields = { owner: req.user.id, name, description, imageUrl, city };
        let barbershop = await Barbershop.findOneAndUpdate(
            { owner: req.user.id },
            { $set: barbershopFields },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(barbershop);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

// ROTA PARA ADICIONAR UM SERVIÇO
router.post('/my-barbershop/services', auth, async (req, res) => {
    const { name, price, duration } = req.body;
    if (!name || !price || !duration) {
        return res.status(400).json({ msg: 'Por favor, preencha todos os campos do serviço.' });
    }
    try {
        const barbershop = await Barbershop.findOne({ owner: req.user.id });
        if (!barbershop) return res.status(404).json({ msg: 'Barbearia não encontrada.' });

        barbershop.services.unshift({ name, price, duration });
        await barbershop.save();
        res.json(barbershop.services);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

// ROTA PARA ATUALIZAR OS HORÁRIOS
router.put('/my-barbershop/hours', auth, async (req, res) => {
    const { operatingHours } = req.body;
    try {
        const barbershop = await Barbershop.findOne({ owner: req.user.id });
        if (!barbershop) return res.status(404).json({ msg: 'Barbearia não encontrada.' });
        barbershop.operatingHours = operatingHours;
        await barbershop.save();
        res.json({ msg: 'Horários atualizados com sucesso!', operatingHours: barbershop.operatingHours });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

// ROTA PARA PEGAR OS DADOS DA BARBEARIA DO USUÁRIO LOGADO
router.get('/my-barbershop', auth, async (req, res) => {
    try {
        const barbershop = await Barbershop.findOne({ owner: req.user.id });
        if (!barbershop) return res.status(404).json({ msg: 'Nenhuma barbearia encontrada.'});
        res.json(barbershop);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

// =======================================================
// ROTAS PÚBLICAS
// =======================================================

// ROTA PÚBLICA PARA LISTAR BARBEARIAS (COM OU SEM FILTRO)
router.get('/', async (req, res) => {
    try {
        const { city } = req.query;
        const filter = city ? { city } : {};
        const barbershops = await Barbershop.find(filter);
        res.json(barbershops);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

// ROTA PÚBLICA PARA PEGAR OS DETALHES DE UMA BARBEARIA
router.get('/:id', async (req, res) => {
    try {
        const barbershop = await Barbershop.findById(req.params.id);
        if (!barbershop) return res.status(404).json({ msg: 'Barbearia não encontrada' });
        res.json(barbershop);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

module.exports = router;