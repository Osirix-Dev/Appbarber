// client/src/pages/HomePage.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import '../App.css'; 

const HomePage = () => {
    const [barbershops, setBarbershops] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBarbershops = async () => {
            try {
                const res = await api.get('/barbershops'); 
                setBarbershops(res.data);
            } catch (error) {
                console.error("Erro ao buscar barbearias:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBarbershops();
    }, []);

    return (
        <div className="page-container">
            <header className="app-header">
                <h1>BarberTime</h1>
                <p>Encontre a barbearia perfeita para você</p>
            </header>
            <main className="barbershop-gallery">
                {loading ? (
                    <p>Carregando barbearias...</p>
                ) : barbershops.length === 0 ? (
                    <p>Nenhuma barbearia cadastrada no momento...</p>
                ) : (
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
};

export default HomePage;