import React from 'react';
import './dashboard.css';

const ClienteHome = () => {
  // Simulamos datos de usuario - en una aplicación real estos vendrían del estado o contexto
  const userData = JSON.parse(localStorage.getItem('user')) || { nombre: 'Cliente', balance: 0 };
  
  return (
    <div className="cliente-dashboard">
      <div className="welcome-banner">
        <h1>Bienvenido, {userData.nombre || 'Usuario'}</h1>
        <p>Tu resumen bancario está listo</p>
      </div>
      
      <div className="balance-overview">
        <div className="balance-card">
          <h3>Balance Total</h3>
          <p className="balance-amount">Q {userData.balance?.toLocaleString() || '0.00'}</p>
          <button className="balance-action">Ver detalles</button>
        </div>
      </div>
      
      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h2>Cuentas</h2>
          <div className="account-cards">
            <div className="account-card">
              <h4>Cuenta de Ahorro</h4>
              <p className="account-number">**** **** **** 4523</p>
              <p className="account-balance">Q 3,250.75</p>
              <div className="account-actions">
                <button>Ver</button>
                <button>Transferir</button>
              </div>
            </div>
            <div className="account-card">
              <h4>Cuenta Corriente</h4>
              <p className="account-number">**** **** **** 7890</p>
              <p className="account-balance">Q 1,120.50</p>
              <div className="account-actions">
                <button>Ver</button>
                <button>Transferir</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-section">
          <h2>Movimientos Recientes</h2>
          <div className="transactions-list">
            <div className="transaction-item">
              <div className="transaction-icon deposit">↓</div>
              <div className="transaction-details">
                <h4>Depósito</h4>
                <p className="transaction-date">Hoy, 10:30 AM</p>
              </div>
              <p className="transaction-amount positive">+ Q 500.00</p>
            </div>
            <div className="transaction-item">
              <div className="transaction-icon withdraw">↑</div>
              <div className="transaction-details">
                <h4>Pago de servicio</h4>
                <p className="transaction-date">Ayer, 15:45 PM</p>
              </div>
              <p className="transaction-amount negative">- Q 120.50</p>
            </div>
            <div className="transaction-item">
              <div className="transaction-icon transfer">⟷</div>
              <div className="transaction-details">
                <h4>Transferencia</h4>
                <p className="transaction-date">03/07/2025, 09:20 AM</p>
              </div>
              <p className="transaction-amount negative">- Q 350.00</p>
            </div>
          </div>
          <button className="see-all-button">Ver todos</button>
        </div>
        
        <div className="dashboard-section">
          <h2>Acciones Rápidas</h2>
          <div className="quick-actions">
            <button className="quick-action-button">
              <span className="action-icon">↑</span>
              <span>Transferir</span>
            </button>
            <button className="quick-action-button">
              <span className="action-icon">+</span>
              <span>Depositar</span>
            </button>
            <button className="quick-action-button">
              <span className="action-icon">$</span>
              <span>Cambio de Divisa</span>
            </button>
            <button className="quick-action-button">
              <span className="action-icon">✓</span>
              <span>Pagos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteHome;
