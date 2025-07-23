// client/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importando nossas páginas e componentes
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import BarbershopDetailPage from './pages/BarbershopDetailPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage'; // Import da nova página
import PrivateRoute from './components/PrivateRoute';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/barbershop/:id" element={<BarbershopDetailPage />} />

            {/* Rota Privada do Barbeiro */}
            <Route 
              path="/dashboard/*"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              } 
            />

            {/* Rota Privada do Admin (adicionada aqui dentro) */}
            <Route 
              path="/admin/*"
              element={
                <PrivateRoute>
                  <AdminDashboardPage />
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