// client/src/pages/admin/BarbershopList.js

import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const BarbershopList = () => {
    const [barbershops, setBarbershops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBarbershops = async () => {
            try {
                const res = await api.get('/admin/barbershops');
                setBarbershops(res.data);
            } catch (err) {
                console.error("Erro ao buscar barbearias:", err);
                setError('Não foi possível carregar as barbearias.');
            } finally {
                setLoading(false);
            }
        };

        fetchBarbershops();
    }, []);

    if (loading) return <p>Carregando barbearias...</p>;
    if (error) return <p style={{ color: '#e74c3c' }}>{error}</p>;

    return (
        <div>
            <h2>Lista de Barbearias Cadastradas</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #444' }}>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Nome da Barbearia</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Dono</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Email do Dono</th>
                    </tr>
                </thead>
                <tbody>
                    {barbershops.map(shop => (
                        <tr key={shop._id} style={{ borderBottom: '1px solid #333' }}>
                            <td style={{ padding: '10px' }}>{shop.name}</td>
                            <td style={{ padding: '10px' }}>{shop.owner?.name || 'N/A'}</td>
                            <td style={{ padding: '10px' }}>{shop.owner?.email || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// A LINHA MAIS IMPORTANTE É ESTA NO FINAL:
export default BarbershopList;