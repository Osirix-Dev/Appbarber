
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Pega o token do cabeçalho da requisição
    const token = req.header('x-auth-token');

    // Se não houver token, nega o acesso
    if (!token) {
        return res.status(401).json({ msg: 'Sem token, autorização negada' });
    }

    // Se houver token, verifica se é válido
    try {
        const decoded = jwt.verify(token, "NOSSA_CHAVE_SECRETA_SUPER_SECRETA");
        req.user = decoded.user; // Adiciona o payload do usuário na requisição
        next(); // Passa para a próxima etapa (a lógica da rota)
    } catch (err) {
        res.status(401).json({ msg: 'Token não é válido' });
    }
};