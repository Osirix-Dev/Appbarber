// server/routes/barbershop.routes.js

// 1. TODAS as importações ficam agrupadas aqui no topo.
const express = require('express');
const router = express.Router();
// 2. Vamos usar o nome 'auth' para o middleware, é mais curto.
const auth = require('../middleware/authMiddleware'); 
// 3. Importando o modelo da barbearia.
const Barbershop = require('../models/Barbershop.model');


// =======================================================
// ROTAS
// =======================================================

// ROTA PARA CRIAR OU ATUALIZAR O PERFIL DA BARBEARIA (PROTEGIDA)
// POST /api/barbershops
router.post('/', auth, async (req, res) => {
    const { name, description, imageUrl } = req.body;

    if (!name || !description || !imageUrl) {
        return res.status(400).json({ msg: 'Por favor, preencha todos os campos.' });
    }

    try {
        const barbershopFields = {
            owner: req.user.id,
            name,
            description,
            imageUrl
        };

        let barbershop = await Barbershop.findOneAndUpdate(
            { owner: req.user.id },
            { $set: barbershopFields },
            { new: true, upsert: true } // upsert: true CRIA se não encontrar
        );
        res.json(barbershop);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

// ROTA PARA ADICIONAR UM SERVIÇO À BARBEARIA (PROTEGIDA)
// POST /api/barbershops/my-barbershop/services
router.post('/my-barbershop/services', auth, async (req, res) => {
    const { name, price, duration } = req.body;
    if (!name || !price || !duration) {
        return res.status(400).json({ msg: 'Por favor, preencha todos os campos do serviço.' });
    }

    try {
        const barbershop = await Barbershop.findOne({ owner: req.user.id });
        if (!barbershop) {
            return res.status(404).json({ msg: 'Barbearia não encontrada. Cadastre primeiro o perfil da sua barbearia.' });
        }

        const newService = { name, price, duration };
        barbershop.services.unshift(newService);
        await barbershop.save();
        res.json(barbershop.services);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

// ROTA PARA PEGAR OS DADOS DA BARBEARIA DO USUÁRIO LOGADO (PROTEGIDA)
// GET /api/barbershops/my-barbershop
router.get('/my-barbershop', auth, async (req, res) => {
    try {
        const barbershop = await Barbershop.findOne({ owner: req.user.id });
        if (!barbershop) {
            return res.status(404).json({ msg: 'Nenhuma barbearia encontrada para este usuário.'});
        }
        res.json(barbershop);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});


// ROTA PÚBLICA PARA LISTAR TODAS AS BARBEARIAS NA HOME
// GET /api/barbershops
router.get('/', async (req, res) => {
    try {
        const barbershops = await Barbershop.find();
        res.json(barbershops);
    } catch(err) {
        res.status(500).send('Erro no Servidor');
    }
});

// ROTA PÚBLICA PARA PEGAR OS DETALHES DE UMA ÚNICA BARBEARIA
// GET /api/barbershops/:id
router.get('/:id', async (req, res) => {
    try {
        const barbershop = await Barbershop.findById(req.params.id);
        if (!barbershop) {
            return res.status(404).json({ msg: 'Barbearia não encontrada' });
        }
        res.json(barbershop);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});
router.put('/my-barbershop/hours', auth, async (req, res) => {
    const { operatingHours } = req.body;

    try {
        const barbershop = await Barbershop.findOne({ owner: req.user.id });

        if (!barbershop) {
            return res.status(404).json({ msg: 'Barbearia não encontrada.' });
        }

        barbershop.operatingHours = operatingHours;
        await barbershop.save();

        res.json({ msg: 'Horários atualizados com sucesso!', operatingHours: barbershop.operatingHours });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

module.exports = router;