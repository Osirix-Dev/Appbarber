// client/src/pages/dashboard/DashboardPage.js

import React, { useState } from 'react';
import '../PageContainer.css';
import ServicesManagement from '../../components/ServicesManagement';
import ProfileManagement from '../../components/ProfileManagement';

// 1. Apenas UMA declaração da constante TABS com as duas abas
const TABS = {
    PROFILE: 'Perfil',
    SERVICES: 'Serviços'
};

const DashboardPage = () => {
    // 2. Definindo a aba "Perfil" como a inicial
    const [activeTab, setActiveTab] = useState(TABS.PROFILE);

    // 3. Apenas UMA função renderContent que lida com os dois casos
    const renderContent = () => {
        switch (activeTab) {
            case TABS.PROFILE:
                return <ProfileManagement />;
            case TABS.SERVICES:
                return <ServicesManagement />;
            default:
                // Define "Perfil" como a tela padrão caso algo dê errado
                return <ProfileManagement />;
        }
    };

    return (
        <div className="page-container" style={{ display: 'flex' }}>
            {/* Sidebar de Navegação */}
            <aside style={{ width: '240px', background: '#1c1c1c', padding: '20px' }}>
                <h1 style={{ color: 'white', fontSize: '1.5rem' }}>Meu Painel</h1>
                <nav>
                    <ul>
                        {/* O map funciona com a constante TABS correta */}
                        {Object.values(TABS).map(tab => (
                            <li key={tab} style={{ listStyle: 'none', margin: '10px 0' }}>
                                <button
                                    onClick={() => setActiveTab(tab)}
                                    // A classe do botão também funcionará corretamente
                                    className={activeTab === tab ? 'button-primary' : 'button-secondary'}
                                >
                                    {tab}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Conteúdo Principal */}
            <main style={{ flex: 1, padding: '20px' }}>
                {renderContent()}
            </main>
        </div>
    );
};

export default DashboardPage;