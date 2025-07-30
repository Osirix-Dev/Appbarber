// client/src/pages/dashboard/DashboardPage.js

import React, { useState } from 'react';
import '../PageContainer.css';
import ProfileManagement from '../../components/ProfileManagement';
import ServicesManagement from '../../components/ServicesManagement';
import AvailabilityManagement from '../../components/AvailabilityManagement';
import AgendaView from '../../components/AgendaView';
import EmployeeManagement from '../../components/EmployeeManagement';

// A constante TABS com todas as nossas seções
const TABS = {
    AGENDA: 'Agenda',
    PROFILE: 'Perfil',
    SERVICES: 'Serviços',
    EMPLOYEES: 'Funcionários',
    AVAILABILITY: 'Horários'
};

const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState(TABS.AGENDA);

    // =======================================================================
    // A CORREÇÃO ESTÁ AQUI: Garantindo que o 'switch' conheça todos os casos
    // =======================================================================
    const renderContent = () => {
        switch (activeTab) {
            case TABS.AGENDA:
                return <AgendaView />;
            case TABS.PROFILE:
                return <ProfileManagement />;
            case TABS.SERVICES:
                return <ServicesManagement />;
                case TABS.EMPLOYEES: // Adicione este case
            return <EmployeeManagement />;
            case TABS.AVAILABILITY:
                return <AvailabilityManagement />;
            default:
                // Se algo der errado, mostre a agenda
                return <AgendaView />;
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