import React from 'react';
import { useEstadisticas } from '../../shared/hooks';
import Loader from '../ui/Loader';

const EstadisticasCards = () => {
  const { estadisticasGenerales, isLoading } = useEstadisticas();

  if (isLoading) return <Loader />;
  if (!estadisticasGenerales) return <div className="no-data-message">No hay estadísticas disponibles</div>;

  return (
    <div className="dashboard-stats-container">
      <div className="dashboard-stat-card">
        <h3>Usuarios Totales</h3>
        <p className="stat-number">{estadisticasGenerales.usuarios.total}</p>
        <div className="stat-details">
          {estadisticasGenerales.usuarios.porRol && estadisticasGenerales.usuarios.porRol.map((rol) => (
            <p key={rol._id} className="stat-detail">
              {rol._id}: {rol.total}
            </p>
          ))}
        </div>
      </div>
      
      <div className="dashboard-stat-card">
        <h3>Cuentas</h3>
        <p className="stat-number">{estadisticasGenerales.cuentas.total}</p>
        <div className="stat-details">
          {estadisticasGenerales.cuentas.porTipo && estadisticasGenerales.cuentas.porTipo.map((tipo) => (
            <p key={tipo._id} className="stat-detail">
              {tipo._id}: {tipo.total}
            </p>
          ))}
          <p className="stat-detail">
            Monto total: Q{estadisticasGenerales.cuentas.montoTotal.toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="dashboard-stat-card">
        <h3>Movimientos</h3>
        <p className="stat-number">{estadisticasGenerales.movimientos.total}</p>
      </div>
      
      <div className="dashboard-stat-card">
        <h3>Productos Activos</h3>
        <p className="stat-number">{estadisticasGenerales.productos.total}</p>
      </div>
    </div>
  );
};

export default EstadisticasCards;
