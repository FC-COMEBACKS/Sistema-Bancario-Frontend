import React from 'react';
import { useEstadisticas } from '../../shared/hooks';
import Loader from '../ui/Loader';

const EstadisticasCards = () => {
  const { estadisticasGenerales, isLoading, hasErrors } = useEstadisticas();

  console.log('EstadisticasCards - Estado:', { estadisticasGenerales, isLoading, hasErrors });

  if (isLoading) return <Loader />;
  
  if (hasErrors) {
    return (
      <div className="dashboard-stats-container">
        <div className="error-message">
          <p>Error al cargar estadísticas</p>
          <small>Verifique la conexión con el servidor o intente más tarde (Error 429 - demasiadas peticiones)</small>
        </div>
      </div>
    );
  }

  if (!estadisticasGenerales) {
    return (
      <div className="dashboard-stats-container">
        <div className="no-data-message">
          <p>No hay estadísticas disponibles</p>
          <small>Los datos pueden estar cargando o no estar disponibles</small>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-stats-container">
      <div className="dashboard-stat-card">
        <h3>Usuarios Totales</h3>
        <p className="stat-number">{estadisticasGenerales?.usuarios?.total || 0}</p>
        <div className="stat-details">
          {estadisticasGenerales?.usuarios?.porRol && estadisticasGenerales.usuarios.porRol.map((rol) => (
            <p key={rol._id} className="stat-detail">
              {rol._id}: {rol.total}
            </p>
          ))}
        </div>
      </div>
      
      <div className="dashboard-stat-card">
        <h3>Cuentas</h3>
        <p className="stat-number">{estadisticasGenerales?.cuentas?.total || 0}</p>
        <div className="stat-details">
          {estadisticasGenerales?.cuentas?.porTipo && estadisticasGenerales.cuentas.porTipo.map((tipo) => (
            <p key={tipo._id} className="stat-detail">
              {tipo._id}: {tipo.total}
            </p>
          ))}
          {estadisticasGenerales?.cuentas?.montoTotal && (
            <p className="stat-detail">
              Monto total: Q{estadisticasGenerales.cuentas.montoTotal.toLocaleString()}
            </p>
          )}
        </div>
      </div>
      
      <div className="dashboard-stat-card">
        <h3>Movimientos</h3>
        <p className="stat-number">{estadisticasGenerales?.movimientos?.total || 0}</p>
      </div>
      
      <div className="dashboard-stat-card">
        <h3>Productos Activos</h3>
        <p className="stat-number">{estadisticasGenerales?.productos?.total || 0}</p>
      </div>
    </div>
  );
};

export default EstadisticasCards;
