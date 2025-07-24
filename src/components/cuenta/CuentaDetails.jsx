import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from '../ui';

const CuentaDetails = ({ cuenta, onEdit, onClose, loading = false }) => {
    if (!cuenta) return null;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-GT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getTipoIcon = (tipo) => {
        switch(tipo) {
            case 'AHORROS': return '💰';
            case 'CORRIENTE': return '💳';
            case 'NOMINA': return '💼';
            default: return '🏦';
        }
    };

    return (
        <div className="cuenta-details-container">
            <div className="details-header">
                <div className="header-icon">👁️</div>
                <h2 className="details-title">Detalles de la Cuenta</h2>
                <p className="details-subtitle">Información completa y actualizada de la cuenta bancaria</p>
            </div>

            <div className="details-grid">
                <div className="detail-card primary">
                    <div className="card-icon">🏦</div>
                    <div className="card-content">
                        <h3 className="card-title">Número de Cuenta</h3>
                        <p className="card-value account-number">{cuenta.numeroCuenta}</p>
                    </div>
                </div>

                <div className="detail-card">
                    <div className="card-icon">{getTipoIcon(cuenta.tipo)}</div>
                    <div className="card-content">
                        <h3 className="card-title">Tipo de Cuenta</h3>
                        <span className={`account-type-badge ${cuenta.tipo.toLowerCase()}`}>
                            {cuenta.tipo}
                        </span>
                    </div>
                </div>

                <div className="detail-card balance">
                    <div className="card-icon">💵</div>
                    <div className="card-content">
                        <h3 className="card-title">Saldo Actual</h3>
                        <p className="card-value balance-amount">{formatCurrency(cuenta.saldo)}</p>
                    </div>
                </div>

                <div className="detail-card">
                    <div className="card-icon">
                        {cuenta.activa ? '✅' : '❌'}
                    </div>
                    <div className="card-content">
                        <h3 className="card-title">Estado</h3>
                        <span className={`status-badge ${cuenta.activa ? 'active' : 'inactive'}`}>
                            {cuenta.activa ? 'Activa' : 'Inactiva'}
                        </span>
                    </div>
                </div>

                <div className="detail-card positive">
                    <div className="card-icon">📈</div>
                    <div className="card-content">
                        <h3 className="card-title">Total Ingresos</h3>
                        <p className="card-value positive-amount">+{formatCurrency(cuenta.ingresos || 0)}</p>
                    </div>
                </div>

                <div className="detail-card negative">
                    <div className="card-icon">📉</div>
                    <div className="card-content">
                        <h3 className="card-title">Total Egresos</h3>
                        <p className="card-value negative-amount">-{formatCurrency(cuenta.egresos || 0)}</p>
                    </div>
                </div>

                <div className="detail-card">
                    <div className="card-icon">📅</div>
                    <div className="card-content">
                        <h3 className="card-title">Fecha de Creación</h3>
                        <p className="card-value date-value">{formatDate(cuenta.fechaCreacion)}</p>
                    </div>
                </div>

                <div className="detail-card full-width">
                    <div className="card-icon">🆔</div>
                    <div className="card-content">
                        <h3 className="card-title">ID de Cuenta</h3>
                        <p className="card-value id-value">{cuenta.cid}</p>
                    </div>
                </div>
            </div>

            {cuenta.usuario && (
                <div className="user-info-section">
                    <div className="section-header">
                        <div className="section-icon">👤</div>
                        <h3 className="section-title">Información del Usuario</h3>
                    </div>
                    <div className="user-info-grid">
                        <div className="user-info-item">
                            <span className="info-label">👤 Nombre:</span>
                            <span className="info-value">{cuenta.usuario.nombre}</span>
                        </div>
                        <div className="user-info-item">
                            <span className="info-label">🏷️ Username:</span>
                            <span className="info-value">@{cuenta.usuario.username}</span>
                        </div>
                    </div>
                </div>
            )}

            {cuenta.ultimosMovimientos && cuenta.ultimosMovimientos.length > 0 && (
                <div className="movements-section">
                    <div className="section-header">
                        <div className="section-icon">📊</div>
                        <h3 className="section-title">Últimos Movimientos</h3>
                    </div>
                    <div className="movements-list">
                        {cuenta.ultimosMovimientos.map((movimiento, index) => (
                            <div key={index} className="movement-item">
                                <div className="movement-info">
                                    <div className="movement-type">
                                        <span className="type-icon">
                                            {movimiento.tipo === 'INGRESO' ? '📈' : '📉'}
                                        </span>
                                        <span className="type-text">{movimiento.tipo}</span>
                                    </div>
                                    <p className="movement-description">{movimiento.descripcion}</p>
                                </div>
                                <div className="movement-amount">
                                    <p className={`amount ${movimiento.tipo === 'INGRESO' ? 'positive' : 'negative'}`}>
                                        {movimiento.tipo === 'INGRESO' ? '+' : '-'}{formatCurrency(Math.abs(movimiento.monto))}
                                    </p>
                                    <p className="movement-date">
                                        {formatDate(movimiento.fechaHora)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="action-buttons">
                {onEdit && (
                    <button
                        onClick={() => onEdit(cuenta)}
                        disabled={loading}
                        className="btn-primary"
                    >
                        <span className="btn-icon">✏️</span>
                        Editar Cuenta
                    </button>
                )}
                
                {onClose && (
                    <button
                        onClick={onClose}
                        className="btn-secondary"
                    >
                        <span className="btn-icon">↩️</span>
                        Volver
                    </button>
                )}
            </div>
        </div>
    );
};

CuentaDetails.propTypes = {
    cuenta: PropTypes.shape({
        cid: PropTypes.string,
        numeroCuenta: PropTypes.string,
        tipo: PropTypes.string,
        saldo: PropTypes.number,
        ingresos: PropTypes.number,
        egresos: PropTypes.number,
        activa: PropTypes.bool,
        fechaCreacion: PropTypes.string,
        usuario: PropTypes.shape({
            uid: PropTypes.string,
            nombre: PropTypes.string,
            username: PropTypes.string
        }),
        ultimosMovimientos: PropTypes.arrayOf(
            PropTypes.shape({
                mid: PropTypes.string,
                tipo: PropTypes.string,
                monto: PropTypes.number,
                fechaHora: PropTypes.string,
                descripcion: PropTypes.string
            })
        )
    }),
    onEdit: PropTypes.func,
    onClose: PropTypes.func,
    loading: PropTypes.bool
};

export default CuentaDetails;