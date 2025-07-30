// server/models/Appointment.model.js

const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    barbershopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Barbershop',
        required: true
    },
    serviceName: {
        type: String,
        required: true
    },
     employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: { // ...
    },
    date: { // Armazenará a data, ex: "2025-07-25"
        type: String,
        required: true
    },
    time: { // Armazenará o horário, ex: "10:30"
        type: String,
        required: true
    },
    clientName: {
        type: String,
        required: true
    },
    clientPhone: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);