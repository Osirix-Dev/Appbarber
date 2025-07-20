// 1. IMPORTAÇÕES
// Importa as bibliotecas necessárias
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Importa os nossos arquivos de rotas
const userRoutes = require('./routes/user.routes');
const barbershopRoutes = require('./routes/barbershop.routes');

// 2. INICIALIZAÇÃO E CONFIGURAÇÃO
// Inicializa o aplicativo Express
const app = express();

// Configura middlewares que rodam em todas as requisições
app.use(cors()); // Permite a comunicação entre front-end e back-end
app.use(express.json()); // Permite que o servidor entenda JSON

// 3. CONEXÃO COM O BANCO DE DADOS
// Sua "chave" de conexão com o MongoDB Atlas
const dbURI = "mongodb+srv://osirixdev:%40Webdev2025@clusterbarber.a0j6i74.mongodb.net/?retryWrites=true&w=majority&appName=ClusterBarber";

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB conectado com sucesso!'))
  .catch((err) => console.log('Erro ao conectar no MongoDB:', err));

// 4. ROTAS DA API
// Define os prefixos para nossas rotas.
// Tudo que for para '/api/users' será gerenciado pelo arquivo userRoutes.
// Tudo que for para '/api/barbershops' será gerenciado pelo arquivo barbershopRoutes.
app.use('/api/users', userRoutes);
app.use('/api/barbershops', barbershopRoutes);

// 5. INICIALIZAÇÃO DO SERVIDOR
// Define a porta onde o servidor vai rodar
const PORT = process.env.PORT || 5000;

// Inicia o servidor e fica "ouvindo" por requisições
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});