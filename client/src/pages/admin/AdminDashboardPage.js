// client/src/pages/admin/AdminDashboardPage.js

import React, { useState } from 'react';
import '../PageContainer.css';
import UserList from './UserList'; // Import padrão (sem chaves)
import BarbershopList from './BarbershopList'; // Import padrão (sem chaves)

const TABS = {
    USERS: 'Usuários',
    BARBERSHOPS: 'Barbearias',
};

const AdminDashboardPage = () => {
    const [activeTab, setActiveTab] = useState(TABS.USERS);

    const renderContent = () => {
        switch (activeTab) {
            case TABS.USERS:
                return <UserList />;
            case TABS.BARBERSHOPS:
                return <BarbershopList />;
            default:
                return <UserList />;
        }
    };

    return (
        <div className="page-container" style={{ display: 'flex' }}>
            <aside style={{ width: '240px', background: '#1c1c1c', padding: '20px' }}>
                <h1 style={{ color: 'white', fontSize: '1.5rem' }}>Painel Admin</h1>
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

export default AdminDashboardPage;