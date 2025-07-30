// server/models/employee.model.js

const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    // O ID da barbearia à qual este funcionário pertence
    barbershopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Barbershop',
        required: true
    },
    // O ID do dono da barbearia que o cadastrou
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Employee', EmployeeSchema);