const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const router = express.Router();

// ROTA DE REGISTRO: POST /api/users/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // 1. Verifica se o usuário já existe
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Usuário já existe' });
        }

        // 2. Cria um novo usuário
        user = new User({ name, email, password });

        // 3. Criptografa a senha antes de salvar
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 4. Salva o usuário no banco de dados
        await user.save();

        // 5. Retorna uma resposta de sucesso (no futuro, retornaremos um token aqui também)
        res.status(201).json({ msg: 'Usuário registrado com sucesso!' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// ROTA DE LOGIN: POST /api/users/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Verifica se o usuário existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Credenciais inválidas' });
        }

        // 2. Compara a senha enviada com a senha criptografada no banco
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciais inválidas' });
        }

        // 3. Cria e retorna um Token JWT (JSON Web Token)
        const payload = {
            user: {
                id: user.id,
                name: user.name
            }
        };

        jwt.sign(
            payload,
            "NOSSA_CHAVE_SECRETA_SUPER_SECRETA", // Use uma variável de ambiente para isso no futuro!
            { expiresIn: 3600 }, // Token expira em 1 hora
            (err, token) => {
                if (err) throw err;
                res.json({ token }); // Retorna o token para o cliente
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;