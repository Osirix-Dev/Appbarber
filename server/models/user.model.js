// server/models/user.model.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // NOVO CAMPO ADICIONADO AQUI
    role: {
        type: String,
        enum: ['user', 'barber', 'admin'], // Só aceita um desses três valores
        default: 'user' // Todo novo usuário começa como 'user'
    }
});

module.exports = mongoose.model('User', UserSchema);