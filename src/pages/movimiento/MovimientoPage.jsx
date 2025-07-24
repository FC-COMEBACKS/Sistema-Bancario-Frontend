import React from 'react';
import MovimientosManagement from '../../components/movimiento/MovimientosManagement';
import './MovimientoPage.css';

const MovimientoPage = () => {
  return (
    <div className="movimiento-page fade-in">
      <div className="page-header">
        <h1> Gestión de Movimientos Bancarios</h1>
        <p className="page-subtitle">Control completo de transacciones y operaciones financieras</p>
      </div>
      <MovimientosManagement />
    </div>
  );
};

export default MovimientoPage;