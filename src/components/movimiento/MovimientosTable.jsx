import React from 'react';

const MovimientosTable = ({ movimientos, isAdmin, onRevertir }) => {
  if (!movimientos || movimientos.length === 0) {
    return (
      <div className="empty-state">
        <h3>📭 No hay movimientos</h3>
        <p>No se encontraron movimientos que coincidan con los filtros aplicados.</p>
      </div>
    );
  }

  const formatMonto = (monto, tipo) => {
    const amount = `Q ${parseFloat(monto).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`;
    let className = 'movimiento-monto ';
    
    switch(tipo) {
      case 'DEPOSITO':
      case 'CREDITO':
        className += 'positivo';
        break;
      case 'TRANSFERENCIA':
      case 'COMPRA':
        className += 'negativo';
        break;
      default:
        className += 'neutro';
    }
    
    return <span className={className}>{amount}</span>;
  };

  const getTipoComponent = (tipo) => {
    const tipoClasses = {
      'TRANSFERENCIA': 'transferencia',
      'DEPOSITO': 'deposito',
      'COMPRA': 'compra',
      'CREDITO': 'credito',
      'CANCELACION': 'cancelacion'
    };

    const tipoTextos = {
      'TRANSFERENCIA': '🔄 Transferencia',
      'DEPOSITO': '💰 Depósito',
      'COMPRA': '🛒 Compra',
      'CREDITO': '💳 Crédito',
      'CANCELACION': '❌ Cancelación'
    };

    return (
      <span className={`movimiento-tipo ${tipoClasses[tipo] || 'neutro'}`}>
        {tipoTextos[tipo] || tipo}
      </span>
    );
  };

  return (
    <table className="movimientos-table">
      <thead>
        <tr>
          <th>📅 Fecha</th>
          <th>🏷️ Tipo</th>
          <th>💰 Monto</th>
          <th>📤 Cuenta Origen</th>
          <th>📥 Cuenta Destino</th>
          <th>📝 Descripción</th>
          {isAdmin && <th>⚙️ Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {movimientos.map((mov) => {
          const cuentaOrigen = mov.cuentaOrigenDetalle || mov.cuentaOrigen;
          const cuentaDestino = mov.cuentaDestinoDetalle || mov.cuentaDestino;
          return (
            <tr key={mov._id || mov.mid} className="fade-in">
              <td>
                {new Date(mov.fechaHora).toLocaleDateString('es-GT', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </td>
              <td>{getTipoComponent(mov.tipo)}</td>
              <td>{formatMonto(mov.monto, mov.tipo)}</td>
              <td>
                <div className="cuenta-info">
                  <span className="cuenta-numero">{cuentaOrigen?.numeroCuenta || '-'}</span>
                  {cuentaOrigen?.titular && (
                    <span className="cuenta-titular">{cuentaOrigen.titular}</span>
                  )}
                </div>
              </td>
              <td>
                <div className="cuenta-info">
                  <span className="cuenta-numero">{cuentaDestino?.numeroCuenta || '-'}</span>
                  {cuentaDestino?.titular && (
                    <span className="cuenta-titular">{cuentaDestino.titular}</span>
                  )}
                </div>
              </td>
              <td>
                <div className="description-cell">
                  {mov.tipo === 'CANCELACION' && mov.cuentaDestinoDetalle?.numeroCuenta
                    ? `🔄 Reversión del depósito a la cuenta: ${mov.cuentaDestinoDetalle.numeroCuenta}`
                    : mov.tipo === 'DEPOSITO' && mov.reversed && mov.cuentaDestinoDetalle?.numeroCuenta
                      ? `🔄 Reversión del depósito a la cuenta: ${mov.cuentaDestinoDetalle.numeroCuenta}`
                      : mov.tipo === 'TRANSFERENCIA' && (cuentaOrigen?.titular || cuentaDestino?.titular)
                        ? `💸 Transferencia: ${cuentaOrigen?.titular || 'Usuario'} → ${cuentaDestino?.titular || 'Usuario'}`
                        : mov.tipo === 'COMPRA' && mov.productoServicio?.nombre
                          ? `🛒 Compra de: ${mov.productoServicio.nombre}`
                          : mov.descripcion || '-'}
                </div>
              </td>
              {isAdmin && (
                <td>
                  {mov.tipo === 'DEPOSITO' && !mov.reversed && (
                    <button
                      className="action-btn revertir"
                      onClick={() => onRevertir && onRevertir(mov)}
                    >
                      ↩️ Revertir
                    </button>
                  )}
                  {((mov.tipo === 'DEPOSITO' && mov.reversed) || mov.tipo === 'CANCELACION') && (
                    <span className="status-badge revertido">✅ Revertido</span>
                  )}
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default MovimientosTable;
