import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCuenta } from '../../shared/hooks';
import { getMovimientosRecientes } from '../../services/api';
import './dashboard.css';

const ClienteHome = () => {
  const navigate = useNavigate();
  
  const userData = useMemo(() => {
    const userDataString = localStorage.getItem('user');
    const parsedData = userDataString ? JSON.parse(userDataString) : { nombre: 'Cliente' };
    return parsedData;
  }, []);
  
  const { cuentas, loading, error, fetchCuentaByUsuario } = useCuenta();
  const [movimientos, setMovimientos] = useState([]);
  const [movimientosLoading, setMovimientosLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Función para refrescar los datos
  const refreshData = useCallback(async () => {
    const userId = userData.uid || userData._id;
    
    if (userId) {
      // Refrescar cuentas
      await fetchCuentaByUsuario(userId);
      
      // Refrescar movimientos
      setMovimientosLoading(true);
      try {
        const response = await getMovimientosRecientes(5);
        if (response && !response.error) {
          setMovimientos(response.data?.movimientos || []);
        }
      } catch (err) {
        console.error('Error al cargar movimientos:', err);
      } finally {
        setMovimientosLoading(false);
      }
    }
  }, [userData.uid, userData._id, fetchCuentaByUsuario]);
  
  useEffect(() => {
    refreshData();
  }, [refreshData, refreshKey]);

  // Efecto para refrescar datos cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [refreshData]);

  // Función pública para refrescar manualmente (se puede llamar desde otros componentes)
  window.refreshClienteHome = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  const balanceTotal = cuentas.reduce((total, cuenta) => {
    return total + (cuenta.saldo || 0);
  }, 0);
  
  const handleNavigateToProfile = () => {
    navigate('/mi-perfil');
  };
  
  const handleNavigateToMisCuentas = () => {
    navigate('/mis-cuentas');
  };
  
  const formatAccountNumber = (numeroCuenta) => {
    if (!numeroCuenta) return '**** **** **** ****';
    const str = numeroCuenta.toString();
    return `**** **** **** ${str.slice(-4)}`;
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-GT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="cliente-dashboard">
      <div className="welcome-banner">
        <h1>Bienvenido, {userData.nombre || 'Usuario'}</h1>
        <p>Tu resumen bancario está listo</p>
      </div>
      
      <div className="balance-overview">
        <div className="balance-card">
          <h3>Balance Total</h3>
          <p className="balance-amount">Q {balanceTotal.toLocaleString('es-GT', { minimumFractionDigits: 2 })}</p>
          <button className="balance-action" onClick={handleNavigateToMisCuentas}>Ver mis cuentas</button>
        </div>
      </div>
      
      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Cuentas</h2>
            <button className="see-all-button" onClick={handleNavigateToMisCuentas}>
              Ver todas
            </button>
          </div>
          {loading ? (
            <div className="loading-message">Cargando cuentas...</div>
          ) : error ? (
            <div className="error-message">Error al cargar cuentas: {error}</div>
          ) : (
            <div className="account-cards">
              {cuentas.length > 0 ? (
                cuentas.map((cuenta) => (
                  <div key={cuenta.cid} className="account-card">
                    <h4>Cuenta de {cuenta.tipo === 'AHORROS' ? 'Ahorro' : 'Corriente'}</h4>
                    <p className="account-number">{formatAccountNumber(cuenta.numeroCuenta)}</p>
                    <p className="account-balance">Q {cuenta.saldo?.toLocaleString('es-GT', { minimumFractionDigits: 2 }) || '0.00'}</p>
                    <div className="account-actions">
                      <button onClick={handleNavigateToMisCuentas}>Ver</button>
                      <button onClick={() => navigate('/movimientos')}>Transferir</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-accounts">
                  <p>No tienes cuentas registradas</p>
                  <p>Contacta con un administrador para crear una cuenta</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="dashboard-section">
          <h2>Movimientos Recientes</h2>
          {movimientosLoading ? (
            <div className="loading-message">Cargando movimientos...</div>
          ) : (
            <div className="transactions-list">
              {movimientos.length > 0 ? (
                movimientos.map((movimiento, index) => (
                  <div key={index} className="transaction-item">
                    <div className={`transaction-icon ${movimiento.tipo?.toLowerCase() || 'transfer'}`}>
                      {movimiento.tipo === 'DEPOSITO' ? '↓' : 
                       movimiento.tipo === 'RETIRO' ? '↑' : '⟷'}
                    </div>
                    <div className="transaction-details">
                      <h4>{movimiento.concepto || movimiento.tipo}</h4>
                      <p className="transaction-date">{formatDate(movimiento.fecha)}</p>
                    </div>
                    <p className={`transaction-amount ${movimiento.tipo === 'DEPOSITO' ? 'positive' : 'negative'}`}>
                      {movimiento.tipo === 'DEPOSITO' ? '+' : '-'} Q {Math.abs(movimiento.monto || 0).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))
              ) : (
                <div className="no-transactions">
                  <p>No hay movimientos recientes</p>
                </div>
              )}
            </div>
          )}
          <button className="see-all-button" onClick={() => navigate('/movimientos')}>Ver todos</button>
        </div>
        
        <div className="dashboard-section">
          <h2>Acciones Rápidas</h2>
          <div className="quick-actions">
            <button className="quick-action-button" onClick={() => navigate('/movimientos')}>
              <span className="action-icon">↑</span>
              <span>Transferir</span>
            </button>
            <button className="quick-action-button" onClick={() => navigate('/divisa/cambio')}>
              <span className="action-icon">$</span>
              <span>Cambio de Divisa</span>
            </button>
            <button className="quick-action-button" onClick={handleNavigateToProfile}>
              <span className="action-icon">👤</span>
              <span>Mi Perfil</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteHome;
