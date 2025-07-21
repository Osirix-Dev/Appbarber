// server/server.js

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

const connectDB = async () => {
    try {
        // Conexão simplificada, sem as opções antigas
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log('MongoDB conectado com sucesso!');
    } catch (err) {
        console.error('Erro ao conectar com o MongoDB:', err.message);
        process.exit(1);
    }
};

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/users', require('./routes/user.routes'));
app.use('/api/barbershops', require('./routes/barbershop.routes'));
app.use('/api/appointments', require('./routes/appointment.routes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});