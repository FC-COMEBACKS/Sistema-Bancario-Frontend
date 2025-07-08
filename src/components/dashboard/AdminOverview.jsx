import React from 'react';
import './dashboard.css';
import EstadisticasCards from './EstadisticasCards';
import ActividadReciente from './ActividadReciente';
import GraficoMovimientos from './GraficoMovimientos';
import ProductosPopulares from './ProductosPopulares';

const AdminOverview = () => {
  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Panel de Administración</h1>
      
      <EstadisticasCards />
      
      <div className="dashboard-grid">
        <ActividadReciente limit={5} />
        <ProductosPopulares />
      </div>
      
      <GraficoMovimientos />
      
      <div className="dashboard-actions">
        <button className="dashboard-action-button">Ver todos los usuarios</button>
        <button className="dashboard-action-button">Generar reportes</button>
        <button className="dashboard-action-button">Configuración del sistema</button>
      </div>
    </div>
  );
};

export default AdminOverview;
