import React, { useState, useEffect } from 'react';
import { DivisasConverter } from '../../components/divisa/DivisasConverter';
import { TasasCambio } from '../../components/divisa/TasasCambio';
import { DivisasManagement } from '../../components/divisa/DivisasManagement';
import { ConvertirSaldoForm } from '../../components/divisa/ConvertirSaldoForm';
import Button from '../../components/ui/Button';
import './divisaPage.css';

const DivisaPage = () => {
  const [activeTab, setActiveTab] = useState('converter');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userDetails = localStorage.getItem('user');
    if (userDetails) {
      try {
        const parsedUser = JSON.parse(userDetails);
        setUser(parsedUser);
      } catch (err) {
        console.error('Error parsing user:', err);
      }
    }
  }, []);

  const tabs = [
    { id: 'converter', label: 'Conversor', icon: '🔄', roles: ['ADMIN', 'CLIENT'] },
    { id: 'saldo', label: 'Saldo de Cuenta', icon: '💳', roles: ['ADMIN', 'CLIENT'] },
    { id: 'rates', label: 'Tasas de Cambio', icon: '💹', roles: ['ADMIN', 'CLIENT'] },
    { id: 'management', label: 'Gestión', icon: '⚙️', roles: ['ADMIN'] }
  ];

  const availableTabs = tabs.filter(tab => 
    !tab.roles || (user && tab.roles.includes(user.rol))
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'converter':
        return <DivisasConverter />;
      case 'saldo':
        return <ConvertirSaldoForm />;
      case 'rates':
        return <TasasCambio />;
      case 'management':
        return <DivisasManagement />;
      default:
        return <DivisasConverter />;
    }
  };

  return (
    <div className="divisa-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Gestión de Divisas</h1>
          <p className="page-description">
            Convierte entre diferentes monedas y consulta las tasas de cambio actuales
          </p>
        </div>
      </div>

      <div className="page-tabs">
        {availableTabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'primary' : 'outline'}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="page-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default DivisaPage;