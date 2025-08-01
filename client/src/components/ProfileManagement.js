// client/src/components/ProfileManagement.js

import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import FormularioLocalizacao from './FormularioLocalizacao';

const ProfileManagement = () => {
    // Estado para os campos de texto do formulário
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        city: ''
    });
    // NOVO: Estado separado para guardar o arquivo de imagem selecionado
    const [imageFile, setImageFile] = useState(null);
    // NOVO: Estado para mostrar a pré-visualização da imagem
    const [imagePreview, setImagePreview] = useState('');
    
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyBarbershop = async () => {
            try {
                const res = await api.get('/barbershops/my-barbershop');
                if (res.data) {
                    const { name, description, city, imageUrl } = res.data;
                    setFormData({ name: name || '', description: description || '', city: city || '' });
                    // Se já tiver uma imagem, mostra ela na pré-visualização
                    if (imageUrl) {
                        setImagePreview(imageUrl);
                    }
                }
            } catch (error) {
                if (error.response?.status !== 404) {
                    setMessage('Erro ao carregar dados da barbearia.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchMyBarbershop();
    }, []);

    const handleTextChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleLocationChange = (cidade) => {
        setFormData(prev => ({ ...prev, city: cidade }));
    };

    // NOVO: Handler para quando um arquivo de imagem é selecionado
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Cria uma URL temporária para a pré-visualização da imagem
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // NOVO: Lógica de envio atualizada para usar FormData
    const onSubmit = async e => {
        e.preventDefault();
        setMessage('');

        // FormData é um tipo especial de objeto para enviar formulários com arquivos
        const submissionData = new FormData();
        submissionData.append('name', formData.name);
        submissionData.append('description', formData.description);
        submissionData.append('city', formData.city);
        
        // Só anexa a imagem se o usuário selecionou um novo arquivo
        if (imageFile) {
            submissionData.append('imageUrl', imageFile);
        }

        try {
            // Ao enviar FormData, o Axios define o 'Content-Type' correto (multipart/form-data) sozinho
            const res = await api.post('/barbershops', submissionData);
            setMessage('Perfil salvo com sucesso!');
            // Atualiza a pré-visualização com a nova imagem vinda do Cloudinary
            if(res.data.imageUrl) {
                setImagePreview(res.data.imageUrl);
            }
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Ocorreu um erro ao salvar o perfil.');
        }
    };

    if (loading) return <p>Carregando perfil...</p>;

    return (
        <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Gerenciar Perfil da Barbearia</h2>
            <form onSubmit={onSubmit} className="form-container" style={{ maxWidth: '600px', margin: 'auto' }}>
                <h3>Dados Públicos da sua Barbearia</h3>
                <input type="text" name="name" value={formData.name} onChange={handleTextChange} placeholder="Nome da Barbearia" required />
                <textarea name="description" value={formData.description} onChange={handleTextChange} placeholder="Uma breve descrição" rows="4" required />
                
                {/* NOVO: Campo de Upload de Arquivo */}
                <div>
                    <label htmlFor="image-upload">Imagem de Capa</label>
                    <input
                        type="file"
                        id="image-upload"
                        name="imageUrl" // O nome aqui deve ser o mesmo que o back-end espera (upload.single('imageUrl'))
                        accept="image/png, image/jpeg" // Aceita apenas imagens
                        onChange={handleFileChange}
                        style={{ display: 'block', marginTop: '5px' }}
                    />
                </div>

                {/* NOVO: Pré-visualização da Imagem */}
                {imagePreview && (
                    <div style={{ marginTop: '15px' }}>
                        <p>Pré-visualização:</p>
                        <img src={imagePreview} alt="Pré-visualização da capa" style={{ width: '100%', borderRadius: '8px' }} />
                    </div>
                )}
                
                <FormularioLocalizacao 
                    onLocationChange={handleLocationChange} 
                    initialCity={formData.city} 
                />

                <button type="submit" className="button-primary">Salvar Perfil</button>
                {message && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{message}</p>}
            </form>
        </div>
    );
};

export default ProfileManagement;