// client/src/pages/HomePage.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import FormularioLocalizacao from '../components/FormularioLocalizacao'; // Importa o formulário
import '../App.css'; 

const HomePage = () => {
    const [barbershops, setBarbershops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cidadeFiltrada, setCidadeFiltrada] = useState(''); // Estado para guardar a cidade do filtro

    // Este useEffect agora busca as barbearias toda vez que a cidadeFiltrada mudar
    useEffect(() => {
        const fetchBarbershops = async () => {
            setLoading(true);
            try {
                // Monta a URL da API com o filtro, se uma cidade for selecionada
                let url = '/barbershops';
                if (cidadeFiltrada) {
                    url += `?city=${encodeURIComponent(cidadeFiltrada)}`;
                }
                
                const res = await api.get(url); 
                setBarbershops(res.data);
            } catch (error) {
                console.error("Erro ao buscar barbearias:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBarbershops();
    }, [cidadeFiltrada]); // A MÁGICA ACONTECE AQUI: refaz a busca quando o filtro muda

    return (
        <div className="page-container">
            <header className="app-header">
                <h1>BarberTime</h1>
                <p>Encontre a barbearia perfeita para você</p>
            </header>

            {/* SEÇÃO DO FILTRO ADICIONADA AQUI */}
            <div className="filter-container" style={{ padding: '20px 60px' }}>
                <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>Filtre por Localização</h3>
                <FormularioLocalizacao 
                    onLocationChange={(cidade) => setCidadeFiltrada(cidade)} 
                />
            </div>
            
            <main className="barbershop-gallery">
                {loading ? (
                    <p>Carregando barbearias...</p>
                ) : barbershops.length === 0 ? (
                    <p>Nenhuma barbearia encontrada para esta seleção.</p>
                ) : (
                    barbershops.map(shop => (
                        <Link to={`/barbershop/${shop._id}`} key={shop._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="barbershop-card">
                                <img src={shop.imageUrl} alt={shop.name} className="barbershop-image" />
                                <div className="barbershop-info">
                                    <h3>{shop.name}</h3>
                                    {/* Exibindo a cidade no card */}
                                    <p style={{ color: '#aaa', fontStyle: 'italic' }}>{shop.city}</p> 
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