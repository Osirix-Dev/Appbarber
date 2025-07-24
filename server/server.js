// server/server.js

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB conectado com sucesso!');
    } catch (err) {
        console.error('Erro ao conectar com o MongoDB:', err.message);
        process.exit(1);
    }
};

connectDB();

// ======================================================================
// A CORREÇÃO FINAL ESTÁ AQUI
// Definimos explicitamente quem pode fazer requisições para nossa API
const corsOptions = {
  origin: [
    'http://localhost:3000', // Permite o acesso do seu ambiente de desenvolvimento local
    'https://appbarber-rust.vercel.app' // Permite o acesso do seu site publicado
  ]
};

app.use(cors(corsOptions));
// ======================================================================

app.use(express.json());

// --- Definição e Uso das Rotas ---
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/barbershops', require('./routes/barbershop.routes'));
app.use('/api/appointments', require('./routes/appointment.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});