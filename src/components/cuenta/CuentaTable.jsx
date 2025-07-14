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

    const columns = [
        {
            header: 'Número de Cuenta',
            field: 'numeroCuenta',
            render: (item) => (
                <span className="font-mono text-sm">{item.numeroCuenta}</span>
            )
        },
        {
            header: 'Usuario',
            field: 'usuario',
            render: (item) => (
                <div>
                    <div className="font-medium">{item.usuario?.nombre || 'N/A'}</div>
                    <div className="text-sm text-gray-600">{item.usuario?.username || 'N/A'}</div>
                </div>
            )
        },
        {
            header: 'Tipo',
            field: 'tipo',
            render: (item) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.tipo === 'AHORROS' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                }`}>
                    {item.tipo}
                </span>
            )
        },
        {
            header: 'Saldo',
            field: 'saldo',
            render: (item) => (
                <span className="font-semibold text-green-600">
                    {formatCurrency(item.saldo)}
                </span>
            )
        },
        {
            header: 'Ingresos Totales',
            field: 'ingresos',
            render: (item) => (
                <span className="text-sm text-green-500">
                    {formatCurrency(item.ingresos || 0)}
                </span>
            )
        },
        {
            header: 'Egresos Totales',
            field: 'egresos',
            render: (item) => (
                <span className="text-sm text-red-500">
                    {formatCurrency(item.egresos || 0)}
                </span>
            )
        },
        {
            header: 'Fecha de Creación',
            field: 'fechaCreacion',
            render: (item) => (
                <span className="text-sm text-gray-600">
                    {formatDate(item.fechaCreacion)}
                </span>
            )
        },
        {
            header: 'Acciones',
            field: 'acciones',
            render: (item) => (
                <div className="flex space-x-2">
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onViewDetails && onViewDetails(item)}
                        title="Ver detalles"
                    >
                        Ver
                    </Button>
                    <EditButton 
                        onClick={() => onEdit && onEdit(item)} 
                        size="sm"
                        title="Editar cuenta"
                    />
                    <DeleteButton 
                        onClick={() => onDelete && onDelete(item)} 
                        size="sm"
                        title="Eliminar cuenta"
                    />
                </div>
            )
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow">
            <Table
                columns={columns}
                data={cuentas}
                isLoading={loading}
                emptyMessage="No hay cuentas registradas"
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