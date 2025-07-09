import React, { useEffect } from 'react';
import { useEstadisticas } from '../../shared/hooks';
import Loader from '../ui/Loader';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('es-GT', options);
};

const ActividadReciente = ({ limit = 5 }) => {
  const { movimientosRecientes, isLoading, hasErrors, fetchMovimientosRecientes } = useEstadisticas();

  useEffect(() => {
    fetchMovimientosRecientes(limit);
  }, [limit]);

  if (isLoading) return <Loader />;
  
  return (
    <div className="dashboard-section">
      <h2>Actividad Reciente</h2>
      
      {hasErrors ? (
        <div className="error-message">
          <p>Error al cargar movimientos recientes</p>
          <small>Verifique la conexión con el servidor</small>
        </div>
      ) : movimientosRecientes && movimientosRecientes.length > 0 ? (
        <div className="dashboard-activity-list">
          {movimientosRecientes.map((movimiento) => (
            <div className="activity-item" key={movimiento.mid}>
              <span className="activity-time">{formatDate(movimiento.fechaHora)}</span>
              <span className="activity-description">
                <strong>{movimiento.tipo}</strong> - 
                {movimiento.cuentaOrigen && <span> Origen: {movimiento.cuentaOrigen.numeroCuenta}</span>}
                {movimiento.cuentaDestino && <span> Destino: {movimiento.cuentaDestino.numeroCuenta}</span>}
                <span> Monto: <strong>Q{movimiento.monto.toLocaleString()}</strong></span>
                {movimiento.descripcion && <span> - {movimiento.descripcion}</span>}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data-message">No hay movimientos recientes</div>
      )}
      
      <div className="see-more-link">
        <a href="/movimientos">Ver todos los movimientos →</a>
      </div>
    </div>
  );
};

export default ActividadReciente;
