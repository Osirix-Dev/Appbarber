// server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // A CORREÇÃO ESTÁ AQUI: Trocamos 'Authorization' por 'authorization' (minúsculo)
    // Isso torna o código mais robusto, pois headers podem ser convertidos para minúsculas.
    const tokenHeader = req.header('authorization');

    // Verifica se o cabeçalho existe
    if (!tokenHeader) {
        return res.status(401).json({ msg: 'Nenhum token, autorização negada.' });
    }

    // Verifica se o formato é 'Bearer token'
    if (!tokenHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'Formato de token inválido.' });
    }

    // Pega apenas o token, sem o 'Bearer '
    const token = tokenHeader.split(' ')[1];

    // Se não houver token após o split
    if (!token) {
        return res.status(401).json({ msg: 'Nenhum token, autorização negada.' });
    }

    // Verifica o token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token não é válido.' });
    }
};