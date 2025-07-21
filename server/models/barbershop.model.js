// server/models/Barbershop.model.js

const mongoose = require('mongoose');

const BarbershopSchema = new mongoose.Schema({
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
    services: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            duration: { type: Number, required: true }
        }
    ], // <--- AQUI ESTÁ A VÍRGULA CORRIGIDA

    operatingHours: {
        type: Map,
        of: {
            isOpen: { type: Boolean, default: false },
            startTime: { type: String, default: '09:00' },
            endTime: { type: String, default: '18:00' }
        }
    }
});

module.exports = mongoose.model('Barbershop', BarbershopSchema);