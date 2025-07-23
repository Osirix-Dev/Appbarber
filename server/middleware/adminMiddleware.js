// server/middleware/adminMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // Precisamos do modelo de usuário

// Este middleware assume que o authMiddleware já foi executado antes
const adminMiddleware = async (req, res, next) => {
    try {
        // req.user foi adicionado pelo middleware de autenticação (authMiddleware)
        const user = await User.findById(req.user.id);

        if (user && user.role === 'admin') {
            next(); // O usuário é um admin, pode passar!
        } else {
            res.status(403).json({ msg: 'Acesso negado. Rota apenas para administradores.' });
        }
    } catch (err) {
        res.status(500).send('Erro no servidor');
    }
};

module.exports = adminMiddleware;