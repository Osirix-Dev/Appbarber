// server/routes/barbershop.routes.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Barbershop = require('../models/barbershop.model.js');
const upload = require('../config/cloudinary'); // Para upload de imagem

// ROTA PARA CRIAR OU ATUALIZAR O PERFIL DA BARBEARIA (COM UPLOAD)
router.post('/', auth, upload.single('imageUrl'), async (req, res) => {
    const { name, description, city } = req.body;
    try {
        const barbershopFields = { owner: req.user.id, name, description, city };
        if (req.file) {
            barbershopFields.imageUrl = req.file.path;
        }
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

// ROTA PARA ADICIONAR UM SERVIÇO À BARBEARIA (PROTEGIDA)
router.post('/my-barbershop/services', auth, async (req, res) => {
    const { name, price, duration, employees } = req.body;
    
    if (!name || !price || !duration) {
        return res.status(400).json({ msg: 'Nome, preço e duração são obrigatórios.' });
    }

    try {
        let barbershop = await Barbershop.findOne({ owner: req.user.id });
        if (!barbershop) {
            return res.status(404).json({ msg: 'Barbearia não encontrada.' });
        }

        const newService = { 
            name, 
            price, 
            duration, 
            employees: employees || []
        };

        barbershop.services.unshift(newService);
        await barbershop.save();
        
        // A CORREÇÃO ESTÁ AQUI:
        // Depois de salvar, nós "populamos" o campo de funcionários para que a resposta
        // venha com os nomes, e não apenas com os IDs.
        await barbershop.populate('services.employees', 'name');

        res.status(201).json(barbershop.services);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

// ROTA PARA DELETAR UM SERVIÇO
router.delete('/my-barbershop/services/:serviceId', auth, async (req, res) => {
    try {
        const barbershop = await Barbershop.findOne({ owner: req.user.id });
        if (!barbershop) return res.status(404).json({ msg: 'Barbearia não encontrada.' });
        
        barbershop.services = barbershop.services.filter(
            ({ id }) => id !== req.params.serviceId
        );

        await barbershop.save();
        res.json(barbershop.services);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

// Outras rotas (ATUALIZAR HORÁRIOS, PEGAR DADOS, ROTAS PÚBLICAS) continuam aqui...
// ... (cole o restante das rotas que já funcionavam)

module.exports = router;