const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Email deve ser único
    password: { type: String, required: true },
}, {
    timestamps: true // Salva a data de criação e atualização
});

const User = mongoose.model('User', UserSchema);

module.exports = User;