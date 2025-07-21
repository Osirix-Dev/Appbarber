// client/src/pages/dashboard/DashboardPage.js

import React, { useState } from 'react';
import '../PageContainer.css';
import ProfileManagement from '../../components/ProfileManagement';
import ServicesManagement from '../../components/ServicesManagement';
import AvailabilityManagement from '../../components/AvailabilityManagement';

// PASSO 1: A constante TABS é declarada AQUI, no topo.
const TABS = {
    PROFILE: 'Perfil',
    SERVICES: 'Serviços',
    AVAILABILITY: 'Horários'
};

// PASSO 2: SÓ DEPOIS o componente DashboardPage começa.
const DashboardPage = () => {
    // Agora, quando esta linha for executada, a constante TABS já existe.
    const [activeTab, setActiveTab] = useState(TABS.PROFILE);

    const renderContent = () => {
        switch (activeTab) {
            case TABS.PROFILE:
                return <ProfileManagement />;
            case TABS.SERVICES:
                return <ServicesManagement />;
            case TABS.AVAILABILITY:
                return <AvailabilityManagement />;
            default:
                return <ProfileManagement />;
        }
    };

    return (
        <div className="page-container" style={{ display: 'flex' }}>
            <aside style={{ width: '240px', background: '#1c1c1c', padding: '20px' }}>
                <h1 style={{ color: 'white', fontSize: '1.5rem' }}>Meu Painel</h1>
                <nav>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {Object.values(TABS).map(tab => (
                            <li key={tab} style={{ margin: '10px 0' }}>
                                <button
                                    onClick={() => setActiveTab(tab)}
                                    className={activeTab === tab ? 'button-primary' : 'button-secondary'}
                                >
                                    {tab}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            <main style={{ flex: 1, padding: '20px' }}>
                {renderContent()}
            </main>
        </div>
    );
};

export default DashboardPage;