import React from 'react';
import './dashboard.css';

const AdminOverview = () => {
  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Panel de Administración</h1>
      
      <div className="dashboard-stats-container">
        <div className="dashboard-stat-card">
          <h3>Usuarios Totales</h3>
          <p className="stat-number">124</p>
          <p className="stat-change positive">+12% desde el mes pasado</p>
        </div>
        
        <div className="dashboard-stat-card">
          <h3>Transacciones</h3>
          <p className="stat-number">1,453</p>
          <p className="stat-change positive">+8% desde el mes pasado</p>
        </div>
        
        <div className="dashboard-stat-card">
          <h3>Nuevas Cuentas</h3>
          <p className="stat-number">28</p>
          <p className="stat-change positive">+15% desde el mes pasado</p>
        </div>
        
        <div className="dashboard-stat-card">
          <h3>Productos Activos</h3>
          <p className="stat-number">35</p>
          <p className="stat-change negative">-2% desde el mes pasado</p>
        </div>
      </div>
      
      <div className="dashboard-section">
        <h2>Actividad Reciente</h2>
        <div className="dashboard-activity-list">
          <div className="activity-item">
            <span className="activity-time">Hoy, 10:45 AM</span>
            <span className="activity-description">Usuario nuevo registrado: <strong>María González</strong></span>
          </div>
          <div className="activity-item">
            <span className="activity-time">Hoy, 09:30 AM</span>
            <span className="activity-description">Transacción grande detectada: <strong>Q25,000.00</strong></span>
          </div>
          <div className="activity-item">
            <span className="activity-time">Ayer, 15:20 PM</span>
            <span className="activity-description">Nuevo producto añadido: <strong>Préstamo Educativo</strong></span>
          </div>
          <div className="activity-item">
            <span className="activity-time">Ayer, 11:05 AM</span>
            <span className="activity-description">Reporte mensual generado por <strong>admin@sistema.com</strong></span>
          </div>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <button className="dashboard-action-button">Ver todos los usuarios</button>
        <button className="dashboard-action-button">Generar reportes</button>
        <button className="dashboard-action-button">Configuración del sistema</button>
      </div>
    </div>
  );
};

export default AdminOverview;
