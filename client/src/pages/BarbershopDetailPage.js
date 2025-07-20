import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import './PageContainer.css';

const BarbershopDetailPage = () => {
    const { id } = useParams(); 
    const [barbershop, setBarbershop] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBarbershop = async () => {
            try {
                const res = await api.get(`/barbershops/${id}`);
                
                // ================================================================
                // AQUI ESTÁ A LINHA QUE ADICIONEI PARA DIAGNÓSTICO
                console.log('Dados recebidos pela API:', res.data);
                // ================================================================

                setBarbershop(res.data);
            } catch (error) {
                console.error("Erro ao buscar detalhes da barbearia:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBarbershop();
    }, [id]);

    if (loading) {
        return <div className="page-container">Carregando...</div>;
    }

    if (!barbershop) {
        return <div className="page-container">Barbearia não encontrada.</div>;
    }

    return (
        <div className="page-container">
            <img 
                src={barbershop.imageUrl} 
                alt={barbershop.name} 
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }} 
            />
            <h1 style={{ marginTop: '20px' }}>{barbershop.name}</h1>
            <p style={{ fontSize: '1.2rem', color: '#ccc' }}>{barbershop.description}</p>
            
            <hr style={{ margin: '30px 0', borderColor: '#333' }} />

            <div className="services-section">
                <h2>Nossos Serviços</h2>
                {/* Lógica para mostrar os serviços que vamos conferir */}
                {barbershop.services && barbershop.services.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {barbershop.services.map((service, index) => (
                            <li key={index} style={{ background: '#222', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
                                {service.name} - R$ {service.price}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Nenhum serviço cadastrado no momento.</p>
                )}
            </div>
        </div>
    );
};

export default BarbershopDetailPage;