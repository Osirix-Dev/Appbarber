// client/src/components/FormularioLocalizacao.js

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Usaremos axios para as requisições, é uma boa prática.

// Este componente espera receber duas props:
// 1. onLocationChange: Uma função para enviar a cidade selecionada para o componente pai.
// 2. initialCity: (Opcional) A cidade atual da barbearia, para o modo de edição.
function FormularioLocalizacao({ onLocationChange, initialCity = '' }) {
    // Estados para guardar as listas da API do IBGE
    const [estados, setEstados] = useState([]);
    const [cidades, setCidades] = useState([]);

    // Estados para guardar a seleção do usuário
    const [estadoSelecionado, setEstadoSelecionado] = useState('');
    const [cidadeSelecionada, setCidadeSelecionada] = useState(initialCity);

    // Efeito para buscar os estados (UF) na API do IBGE
    useEffect(() => {
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
            .then(response => {
                setEstados(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar estados:", error);
            });
    }, []); // Array vazio [] garante que isso só executa uma vez.

    // Efeito para buscar as cidades sempre que um estado for selecionado
    useEffect(() => {
        if (!estadoSelecionado) {
            setCidades([]);
            return;
        }

        axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`)
            .then(response => {
                setCidades(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar cidades:", error);
            });
    }, [estadoSelecionado]); // Depende do estadoSelecionado

    // Efeito para notificar o componente pai sobre a mudança de cidade
    useEffect(() => {
        // Sempre que a cidadeSelecionada mudar, chamamos a função do pai.
        onLocationChange(cidadeSelecionada);
    }, [cidadeSelecionada, onLocationChange]);


    return (
        <>
            {/* Dropdown de Estados */}
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="estado">Estado</label>
                <select
                    id="estado"
                    value={estadoSelecionado}
                    onChange={(e) => setEstadoSelecionado(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                >
                    <option value="">Selecione um Estado</option>
                    {estados.map(estado => (
                        <option key={estado.id} value={estado.sigla}>
                            {estado.nome}
                        </option>
                    ))}
                </select>
            </div>

            {/* Dropdown de Cidades */}
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="cidade">Cidade</label>
                <select
                    id="cidade"
                    value={cidadeSelecionada}
                    onChange={(e) => setCidadeSelecionada(e.target.value)}
                    disabled={!estadoSelecionado && !initialCity} // Desabilitado se nenhum estado foi escolhido
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                >
                    <option value="">Selecione uma Cidade</option>
                    {cidades.map(cidade => (
                        <option key={cidade.id} value={cidade.nome}>
                            {cidade.nome}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
}

export default FormularioLocalizacao;