// client/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importando nossas páginas e componentes
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import BarbershopDetailPage from './pages/BarbershopDetailPage';
import PrivateRoute from './components/PrivateRoute';
import Navigation from './components/Navigation'; // Supondo que você moveu a Navegação para sua própria pasta

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation /> {/* Seu componente de navegação que já está funcionando */}
        <main>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* AQUI ESTÁ A ROTA QUE ESTAVA FALTANDO */}
            <Route path="/barbershop/:id" element={<BarbershopDetailPage />} />

            {/* Rota Privada */}
            <Route 
              path="/dashboard/*" // Adicionado "/*" para futuras rotas aninhadas no painel
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;