// client/src/components/EmployeeManagement.js

import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [newEmployeeName, setNewEmployeeName] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // Função para buscar os funcionários
    const fetchEmployees = async () => {
        try {
            const res = await api.get('/employees/my-employees');
            setEmployees(res.data);
        } catch (err) {
            console.error("Erro ao buscar funcionários:", err);
            setMessage('Não foi possível carregar a lista de funcionários.');
        } finally {
            setLoading(false);
        }
    };

    // Busca os funcionários quando o componente é carregado
    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.post('/employees', { name: newEmployeeName });
            setNewEmployeeName(''); // Limpa o campo
            fetchEmployees(); // Atualiza a lista de funcionários
            setMessage('Funcionário adicionado com sucesso!');
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Erro ao adicionar funcionário.');
        }
    };

    const handleDelete = async (employeeId) => {
        if (window.confirm('Tem certeza que deseja remover este funcionário?')) {
            try {
                await api.delete(`/employees/${employeeId}`);
                fetchEmployees(); // Atualiza a lista
                setMessage('Funcionário removido com sucesso!');
            } catch (err) {
                setMessage(err.response?.data?.msg || 'Erro ao remover funcionário.');
            }
        }
    };

    if (loading) return <p>Carregando...</p>;

    return (
        <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Gerenciar Funcionários</h2>
            
            {/* Formulário para adicionar novo funcionário */}
            <form onSubmit={handleSubmit} className="form-container" style={{ maxWidth: '600px', margin: 'auto', marginBottom: '40px' }}>
                <h3>Adicionar Novo Funcionário</h3>
                <input
                    type="text"
                    value={newEmployeeName}
                    onChange={(e) => setNewEmployeeName(e.target.value)}
                    placeholder="Nome do funcionário"
                    required
                />
                <button type="submit" className="button-primary">Adicionar</button>
            </form>

            {message && <p style={{ textAlign: 'center', margin: '20px 0' }}>{message}</p>}

            {/* Lista de funcionários existentes */}
            <div>
                <h3>Meus Funcionários</h3>
                {employees.length === 0 ? (
                    <p>Nenhum funcionário cadastrado.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {employees.map(emp => (
                            <div key={emp._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#222', padding: '15px', borderRadius: '8px' }}>
                                <span style={{ fontSize: '1.1rem' }}>{emp.name}</span>
                                <button onClick={() => handleDelete(emp._id)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>
                                    Remover
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeManagement;