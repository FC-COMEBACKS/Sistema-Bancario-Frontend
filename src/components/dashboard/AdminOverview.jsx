import React from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import EstadisticasCards from './EstadisticasCards';
import ActividadReciente from './ActividadReciente';
import GraficoMovimientos from './GraficoMovimientos';
import ProductosPopulares from './ProductosPopulares';

const AdminOverview = () => {
  const navigate = useNavigate();

  const handleNavigateToUsers = () => {
    navigate('/usuarios');
  };

  const handleNavigateToProfile = () => {
    navigate('/mi-perfil');
  };

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
        <button className="dashboard-action-button" onClick={handleNavigateToUsers}>
          Ver todos los usuarios
        </button>
        <button className="dashboard-action-button" onClick={handleNavigateToProfile}>
          Administrar mi perfil
        </button>
      </div>
    </div>
  );
};

export default AdminOverview;
