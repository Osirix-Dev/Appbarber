// server/models/Barbershop.js

const mongoose = require('mongoose');

const BarbershopSchema = new mongoose.Schema({
    // ... (owner, name, description, imageUrl que já temos)
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    // NOVO CAMPO ADICIONADO AQUI
    services: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            duration: { type: Number, required: true } // Duração em minutos
        }
    ]
});

module.exports = mongoose.model('Barbershop', BarbershopSchema);
