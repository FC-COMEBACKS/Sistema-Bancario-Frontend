import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from '../ui';
import { EditButton, DeleteButton } from '../index';

const CuentaTable = ({ cuentas, onEdit, onDelete, onViewDetails, loading = false }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-GT');
    };

    const getTipoIcon = (tipo) => {
        switch(tipo) {
            case 'AHORROS': return '💰';
            case 'CORRIENTE': return '💳';
            case 'NOMINA': return '💼';
            default: return '🏦';
        }
    };

    const columns = [
        {
            header: 'Número de Cuenta',
            field: 'numeroCuenta',
            render: (item) => (
                <div className="account-number">
                    <span className="account-icon">🏦</span>
                    <span className="number">{item.numeroCuenta}</span>
                </div>
            )
        },
        {
            header: 'Usuario',
            field: 'usuario',
            render: (item) => (
                <div className="user-info">
                    <div className="name">{item.usuario?.nombre || 'N/A'}</div>
                    <div className="username">@{item.usuario?.username || 'N/A'}</div>
                </div>
            )
        },
        {
            header: 'Tipo',
            field: 'tipo',
            render: (item) => (
                <span className={`account-type ${item.tipo.toLowerCase()}`}>
                    <span className="type-icon">{getTipoIcon(item.tipo)}</span>
                    <span className="type-text">{item.tipo}</span>
                </span>
            )
        },
        {
            header: 'Saldo',
            field: 'saldo',
            render: (item) => (
                <div className="balance-info">
                    <span className="amount primary">{formatCurrency(item.saldo)}</span>
                </div>
            )
        },
        {
            header: 'Ingresos Totales',
            field: 'ingresos',
            render: (item) => (
                <div className="income-info">
                    <span className="amount positive">+{formatCurrency(item.ingresos || 0)}</span>
                </div>
            )
        },
        {
            header: 'Egresos Totales',
            field: 'egresos',
            render: (item) => (
                <div className="expense-info">
                    <span className="amount negative">-{formatCurrency(item.egresos || 0)}</span>
                </div>
            )
        },
        {
            header: 'Fecha de Creación',
            field: 'fechaCreacion',
            render: (item) => (
                <div className="date-info">
                    <span className="date-icon">📅</span>
                    <span className="date-text">{formatDate(item.fechaCreacion)}</span>
                </div>
            )
        },
        {
            header: 'Acciones',
            field: 'acciones',
            render: (item) => (
                <div className="table-actions">
                    <button
                        className="action-btn view"
                        onClick={() => onViewDetails && onViewDetails(item)}
                        title="Ver detalles"
                    >
                        👁️
                    </button>
                    <button
                        className="action-btn edit"
                        onClick={() => onEdit && onEdit(item)}
                        title="Editar cuenta"
                    >
                        ✏️
                    </button>
                    <button
                        className="action-btn delete"
                        onClick={() => onDelete && onDelete(item)}
                        title="Eliminar cuenta"
                    >
                        🗑️
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="modern-table-wrapper">
            <Table
                columns={columns}
                data={cuentas}
                isLoading={loading}
                emptyMessage="No hay cuentas registradas"
                className="modern-accounts-table"
            />
        </div>
    );
};

CuentaTable.propTypes = {
    cuentas: PropTypes.arrayOf(
        PropTypes.shape({
            cid: PropTypes.string,
            numeroCuenta: PropTypes.string.isRequired,
            tipo: PropTypes.string.isRequired,
            saldo: PropTypes.number,
            ingresos: PropTypes.number,
            egresos: PropTypes.number,
            fechaCreacion: PropTypes.string,
            usuario: PropTypes.shape({
                nombre: PropTypes.string,
                username: PropTypes.string
            })
        })
    ).isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onViewDetails: PropTypes.func,
    loading: PropTypes.bool
};

export default CuentaTable;