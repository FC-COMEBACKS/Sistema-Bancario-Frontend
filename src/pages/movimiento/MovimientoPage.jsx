import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MovimientosManagement from '../../components/movimiento/MovimientosManagement';
import TransferForm from '../../components/movimiento/TransferForm';
import DepositoForm from '../../components/movimiento/DepositoForm';
import CreditoForm from '../../components/movimiento/CreditoForm';
import './MovimientoPage.css';

const MovimientoPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isTransferPage = location.pathname === '/transferencias';
  const isDepositoPage = location.pathname === '/depositos';
  const isCreditoPage = location.pathname === '/creditos';

  if (isTransferPage) {
    return (
      <div className="movimiento-page fade-in">
        <div className="page-header">
          <h1>Nueva Transferencia</h1>
          <p className="page-subtitle">Realiza transferencias entre cuentas de forma segura</p>
        </div>
        <div className="transfer-form-container">
          <TransferForm 
            isOpen={true} 
            isStandalone={true}
            onClose={() => navigate('/movimientos')}
            onSuccess={() => navigate('/movimientos')}
          />
        </div>
      </div>
    );
  }

  if (isDepositoPage) {
    return (
      <div className="movimiento-page fade-in">
        <div className="page-header">
          <h1>💰 Nuevo Depósito</h1>
          <p className="page-subtitle">Realiza depósitos a cuentas de forma segura</p>
        </div>
        <div className="transfer-form-container">
          <DepositoForm 
            isOpen={true} 
            isStandalone={true}
            onClose={() => navigate('/movimientos')}
            onSuccess={() => navigate('/movimientos')}
          />
        </div>
      </div>
    );
  }

  if (isCreditoPage) {
    return (
      <div className="movimiento-page fade-in">
        <div className="page-header">
          <h1>💳 Nuevo Crédito</h1>
          <p className="page-subtitle">Realiza créditos a cuentas de forma segura</p>
        </div>
        <div className="transfer-form-container">
          <CreditoForm 
            isOpen={true} 
            isStandalone={true}
            onClose={() => navigate('/movimientos')}
            onSuccess={() => navigate('/movimientos')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="movimiento-page fade- in">
      <div className="page-header">
        <h1>Gestión de Movimientos Bancarios</h1>
        <p className="page-subtitle">Control completo de transacciones y operaciones financieras</p>
      </div>
      <MovimientosManagement />
    </div>
  );
};

export default MovimientoPage;