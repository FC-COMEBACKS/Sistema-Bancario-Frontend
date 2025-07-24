import React from 'react';
import { Link } from 'react-router-dom';
import './dashboard.css';

const WelcomeGuest = () => {
  return (
    <div className="welcome-guest-container">
      <div className="welcome-guest-content">
        <h1 className="welcome-title">Bienvenido al Sistema Bancario</h1>
        <p className="welcome-description">
          Por favor inicia sesión para acceder a todas las funcionalidades del sistema.
        </p>
        <div className="welcome-actions">
          <Link to="/auth" className="welcome-button login">//
            Iniciar Sesión
          </Link>
          <Link to="/auth/register" className="welcome-button register">
            Registrarse
          </Link>
        </div>
      </div>
      
      <div className="welcome-features">
        <h2>Nuestros servicios</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💸</div>
            <h3>Transferencias</h3>
            <p>Realiza transferencias a cualquier cuenta de forma segura y rápida.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Pagos</h3>
            <p>Paga tus servicios y facturas desde la comodidad de tu hogar.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Reportes</h3>
            <p>Visualiza el historial de tus transacciones y movimientos.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Seguridad</h3>
            <p>Tu dinero y datos están protegidos con la más alta tecnología.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeGuest;
