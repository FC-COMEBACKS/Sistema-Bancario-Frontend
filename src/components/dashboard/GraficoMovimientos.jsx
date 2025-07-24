import React, { useState, useEffect } from 'react';
import { useEstadisticas } from '../../shared/hooks';
import Loader from '../ui/Loader';

const GraficoMovimientos = () => {
  const [periodo, setPeriodo] = useState('mensual');
  const { estadisticasMovimientos, isLoading, fetchEstadisticasMovimientos } = useEstadisticas();

  useEffect(() => {
    fetchEstadisticasMovimientos(periodo);
  }, [periodo]);

  const handlePeriodoChange = (e) => {
    setPeriodo(e.target.value);
  };

  if (isLoading) return <Loader />;
  
  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>Estadísticas de Movimientos</h2>
        <select 
          value={periodo} 
          onChange={handlePeriodoChange}
          className="periodo-selector"
        >
          <option value="semanal">Semanal</option>
          <option value="mensual">Mensual</option>
          <option value="anual">Anual</option>
        </select>
      </div>
      
      {estadisticasMovimientos && estadisticasMovimientos.porTipo ? (
        <div className="estadisticas-container">
          <div className="estadisticas-por-tipo">
            <h3>Movimientos por Tipo</h3>
            <div className="tipos-lista">
              {estadisticasMovimientos.porTipo.map((tipo) => (
                <div key={tipo._id} className="tipo-item">
                  <span className="tipo-nombre">{tipo._id}</span>
                  <span className="tipo-total">{tipo.total}</span>
                  <span className="tipo-monto">Q{tipo.montoTotal.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="estadisticas-por-fecha">
            <h3>Movimientos por Fecha</h3>
            {estadisticasMovimientos.porFecha && estadisticasMovimientos.porFecha.length > 0 ? (
              <div className="fechas-lista">
                {estadisticasMovimientos.porFecha.map((fecha) => (
                  <div key={fecha._id} className="fecha-item">
                    <span className="fecha-nombre">{fecha._id}</span>
                    <span className="fecha-total">{fecha.total} movimientos</span>
                    <span className="fecha-monto">Q{fecha.montoTotal.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data-message">No hay datos para este período</div>
            )}
          </div>
        </div>
      ) : (
        <div className="no-data-message">No hay estadísticas de movimientos disponibles</div>
      )}
    </div>
  );
};

export default GraficoMovimientos;
