// server/routes/admin.routes.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
// A CORREÇÃO ESTÁ AQUI: caminhos 100% iguais aos nomes dos arquivos
const User = require('../models/user.model.js');
const Barbershop = require('../models/barbershop.model.js');

// ROTA PARA BUSCAR TODOS OS USUÁRIOS
router.get('/users', [auth, admin], async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

// ROTA PARA BUSCAR TODAS AS BARBEARIAS
router.get('/barbershops', [auth, admin], async (req, res) => {
    try {
        const barbershops = await Barbershop.find().populate('owner', ['name', 'email']);
        res.json(barbershops);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

module.exports = router;