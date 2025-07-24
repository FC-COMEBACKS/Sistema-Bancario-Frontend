import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from '../ui';
import { EditButton, DeleteButton } from '../index';

const CuentaCard = ({ cuenta, onEdit, onDelete, onViewDetails }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ',
            minimumFractionDigits: 2
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
            case 'AHORROS': return '🏦';
            case 'CORRIENTE': return '💼';
            case 'EMPRESARIAL': return '🏢';
            default: return '💳';
        }
    };

    const getTipoClass = (tipo) => {
        return tipo ? tipo.toLowerCase() : 'corriente';
    };

    return (
        <div className={`cuenta-card tipo-${getTipoClass(cuenta.tipo)}`}>
            <div className="cuenta-header">
                <div>
                    <h3 className="cuenta-numero">
                        {getTipoIcon(cuenta.tipo)} {cuenta.numeroCuenta}
                    </h3>
                    <p className="cuenta-propietario">
                        👤 {cuenta.usuario?.nombre || 'Usuario'} 
                        <span style={{opacity: 0.7}}>({cuenta.usuario?.username || 'N/A'})</span>
                    </p>
                </div>
                <span className={`cuenta-tipo-badge ${getTipoClass(cuenta.tipo)}`}>
                    {cuenta.tipo || 'CORRIENTE'}
                </span>
            </div>

            <div className="cuenta-body">
                <div className="cuenta-saldo">
                    <div className="saldo-label">💰 Saldo Actual</div>
                    <div className="saldo-amount">{formatCurrency(cuenta.saldo)}</div>
                </div>

                <div className="cuenta-stats">
                    <div className="stat-item">
                        <div className="stat-label">📈 Ingresos</div>
                        <div className="stat-value ingreso">
                            {formatCurrency(cuenta.ingresos || 0)}
                        </div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">📉 Egresos</div>
                        <div className="stat-value egreso">
                            {formatCurrency(cuenta.egresos || 0)}
                        </div>
                    </div>
                </div>

                <div className="cuenta-meta">
                    <div className="fecha-creacion">
                        📅 Creada: {formatDate(cuenta.fechaCreacion)}
                    </div>
                    <span className={`estado-badge ${cuenta.activa ? 'activa' : 'inactiva'}`}>
                        {cuenta.activa ? '✅ Activa' : '❌ Inactiva'}
                    </span>
                </div>

                <div className="cuenta-actions">
                    <Button
                        className="btn-view"
                        onClick={() => onViewDetails && onViewDetails(cuenta)}
                        title="Ver detalles completos"
                    >
                        👁️ Ver
                    </Button>
                    <Button
                        className="btn-edit"
                        onClick={() => onEdit && onEdit(cuenta)}
                        title="Editar cuenta"
                    >
                        ✏️ Editar
                    </Button>
                    <Button
                        className="btn-delete"
                        onClick={() => onDelete && onDelete(cuenta)}
                        title="Eliminar cuenta"
                    >
                        🗑️ Eliminar
                    </Button>
                </div>
            </div>
        </div>
    );
};

CuentaCard.propTypes = {
    cuenta: PropTypes.shape({
        cid: PropTypes.string,
        numeroCuenta: PropTypes.string.isRequired,
        tipo: PropTypes.string.isRequired,
        saldo: PropTypes.number.isRequired,
        ingresos: PropTypes.number,
        egresos: PropTypes.number,
        activa: PropTypes.bool,
        fechaCreacion: PropTypes.string,
        usuario: PropTypes.shape({
            nombre: PropTypes.string,
            username: PropTypes.string
        })
    }).isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onViewDetails: PropTypes.func
};

export default CuentaCard;