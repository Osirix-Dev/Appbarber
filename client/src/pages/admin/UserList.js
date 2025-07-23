// client/src/pages/admin/UserList.js

import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
console.log('--- UserList está importando a API:', api);

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Usando a rota de admin que criamos no back-end
                const res = await api.get('/admin/users');
                setUsers(res.data);
            } catch (err) {
                console.error("Erro ao buscar usuários:", err);
                setError('Não foi possível carregar os usuários.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <p>Carregando usuários...</p>;
    if (error) return <p style={{ color: '#e74c3c' }}>{error}</p>;

    return (
        <div>
            <h2>Lista de Usuários do Sistema</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #444' }}>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Nome</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Cargo (Role)</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id} style={{ borderBottom: '1px solid #333' }}>
                            <td style={{ padding: '10px' }}>{user.name}</td>
                            <td style={{ padding: '10px' }}>{user.email}</td>
                            <td style={{ padding: '10px' }}>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;