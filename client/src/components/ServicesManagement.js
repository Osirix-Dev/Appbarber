// client/src/components/ServicesManagement.js

import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const ServicesManagement = () => {
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({ name: '', price: '', duration: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [servicesRes, employeesRes] = await Promise.all([
                    api.get('/barbershops/my-barbershop'),
                    api.get('/employees/my-employees')
                ]);
                
                await servicesRes.data.populate('services.employees', 'name');
                setServices(servicesRes.data.services || []);
                setEmployees(employeesRes.data || []);
            } catch (err) {
                console.error("Erro ao buscar dados:", err);
                setError('Não foi possível carregar os dados da página.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleEmployeeSelection = (employeeId) => {
        setSelectedEmployees(prev => prev.includes(employeeId) ? prev.filter(id => id !== employeeId) : [...prev, employeeId]);
    };

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            const serviceData = { ...formData, employees: selectedEmployees };
            const res = await api.post('/barbershops/my-barbershop/services', serviceData);
            setServices(res.data || []);
            setFormData({ name: '', price: '', duration: '' });
            setSelectedEmployees([]);
        } catch (err) {
            setError(err.response?.data?.msg || 'Ocorreu um erro ao adicionar o serviço.');
        }
    };
    
    const handleDelete = async (serviceId) => {
        if (window.confirm('Tem certeza que deseja remover este serviço?')) {
            try {
                const res = await api.delete(`/barbershops/my-barbershop/services/${serviceId}`);
                setServices(res.data?.services || []);
            } catch (err) {
                setError(err.response?.data?.msg || 'Erro ao remover serviço.');
            }
        }
    };

    if (loading) return <p>Carregando...</p>;

    return (
        <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Gerenciar Serviços</h2>
            
            <div className="form-container" style={{ background: '#1c1c1c', padding: '20px', borderRadius: '8px', marginBottom: '40px' }}>
                <h3>Adicionar Novo Serviço</h3>
                <form onSubmit={onSubmit}>
                    <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="Nome (ex: Corte Tesoura)" required />
                    <input type="number" name="price" value={formData.price} onChange={onChange} placeholder="Preço (ex: 40)" required style={{marginTop: '1rem'}} />
                    <input type="number" name="duration" value={formData.duration} onChange={onChange} placeholder="Duração em minutos (ex: 30)" required style={{marginTop: '1rem'}} />

                    <div style={{ marginTop: '1.5rem' }}>
                        <label style={{fontWeight: 'bold'}}>Quais funcionários realizam este serviço?</label>
                        <div className="checkbox-list-container">
                            <div className="checkbox-list">
                                {employees.length > 0 ? employees.map(emp => (
                                    <div key={emp._id} className="checkbox-item">
                                        <input type="checkbox" id={emp._id} value={emp._id} checked={selectedEmployees.includes(emp._id)} onChange={() => handleEmployeeSelection(emp._id)} />
                                        <label htmlFor={emp._id}>{emp.name}</label>
                                    </div>
                                )) : <p>Nenhum funcionário cadastrado.</p>}
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="button-primary" style={{marginTop: '1.5rem'}}>Adicionar Serviço</button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>

            <div className="services-list">
                <h3>Serviços Cadastrados</h3>
                {services.length === 0 ? (
                    <p style={{ textAlign: 'center' }}>Nenhum serviço cadastrado ainda.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {services.map((service) => (
                            <div key={service._id} className="service-card">
                                <div className="service-info">
                                    <p className="service-name">{service.name}</p>
                                    <p className="service-details">R$ {service.price.toFixed(2)} - {service.duration} min</p>
                                    <div className="service-employees">
                                        <strong>Profissionais:</strong> {service.employees?.map(emp => emp.name).join(', ') || 'Nenhum associado'}
                                    </div>
                                </div>
                                <div className="service-actions">
                                    <button onClick={() => handleDelete(service._id)} className="delete-btn">
                                        Remover
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServicesManagement;