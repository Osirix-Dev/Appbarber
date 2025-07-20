import React, { useState, useEffect } from 'react';
import '../App.css'; // Vamos usar este arquivo de estilos
import { Link } from 'react-router-dom';

function App() {
  // 'useState' para guardar la lista de barbearias que virão da API
  const [barbershops, setBarbershops] = useState([]);

  // 'useEffect' para buscar os dados da nossa API assim que a página carregar
  useEffect(() => {
    // O endereço do nosso back-end.
    // O React roda na porta 3001, e nosso servidor na 5000.
    // É importante o servidor (back-end) estar rodando!
    fetch('http://localhost:5000/api/barbershops')
      .then(response => response.json())
      .then(data => setBarbershops(data))
      .catch(error => console.error("Erro ao buscar barbearias:", error));
  }, []); // O array vazio [] significa que isso roda apenas uma vez

  return (
    <div className="app">
      <header className="app-header">
        <h1>BarberTime</h1>
        <p>Encontre a barbearia perfeita para você</p>
      </header>
      <main className="barbershop-gallery">
        {/* Verificamos se a lista de barbearias está vazia */}
        {barbershops.length === 0 ? (
          <p>Nenhuma barbearia cadastrada no momento... (Verifique se o servidor back-end está rodando)</p>
        ) : (
          // Se não estiver vazia, usamos .map() para criar um card para cada uma
          barbershops.map(shop => (
           <Link to={`/barbershop/${shop._id}`} key={shop._id} style={{ textDecoration: 'none', color: 'inherit' }}>
    <div className="barbershop-card">
        <img src={shop.imageUrl} alt={shop.name} className="barbershop-image" />
        <div className="barbershop-info">
            <h3>{shop.name}</h3>
            <p>{shop.description}</p>
            <button className="view-button">Ver Serviços</button>
        </div>
    </div>
</Link>
          ))
        )}
      </main>
    </div>
  );
}

export default App;