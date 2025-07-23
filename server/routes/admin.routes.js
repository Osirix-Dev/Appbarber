// server/routes/admin.routes.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const User = require('../models/user.model');
const Barbershop = require('../models/Barbershop.model');

// ROTA PARA BUSCAR TODOS OS USUÁRIOS
// GET /api/admin/users
// A rota usa os dois middlewares em sequência: primeiro verifica se está logado, depois se é admin.
router.get('/users', [auth, admin], async (req, res) => {
    try {
        const users = await User.find().select('-password'); // .select('-password') remove a senha da resposta
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

// ROTA PARA BUSCAR TODAS AS BARBEARIAS
// GET /api/admin/barbershops
router.get('/barbershops', [auth, admin], async (req, res) => {
    try {
        // .populate() busca os dados do dono da barbearia e os inclui na resposta
        const barbershops = await Barbershop.find().populate('owner', ['name', 'email']);
        res.json(barbershops);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

module.exports = router;