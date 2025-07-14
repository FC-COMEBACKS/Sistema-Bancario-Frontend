import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from '../ui';
import { EditButton, DeleteButton } from '../index';

const CuentaCard = ({ cuenta, onEdit, onDelete, onViewDetails }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-GT');
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{cuenta.numeroCuenta}</h3>
                        <p className="text-sm text-gray-600">
                            {cuenta.usuario?.nombre} ({cuenta.usuario?.username})
                        </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                        cuenta.tipo === 'AHORROS' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                    }`}>
                        {cuenta.tipo}
                    </span>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Saldo:</span>
                        <span className="font-semibold text-green-600">{formatCurrency(cuenta.saldo)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Ingresos:</span>
                        <span className="text-sm text-green-500">{formatCurrency(cuenta.ingresos || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Egresos:</span>
                        <span className="text-sm text-red-500">{formatCurrency(cuenta.egresos || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Creada:</span>
                        <span className="text-sm text-gray-500">{formatDate(cuenta.fechaCreacion)}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                        cuenta.activa 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {cuenta.activa ? 'Activa' : 'Inactiva'}
                    </span>
                    
                    <div className="flex space-x-2">
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => onViewDetails && onViewDetails(cuenta)}
                            title="Ver detalles"
                        >
                            Ver
                        </Button>
                        <EditButton 
                            onClick={() => onEdit && onEdit(cuenta)} 
                            size="sm"
                            title="Editar cuenta"
                        />
                        <DeleteButton 
                            onClick={() => onDelete && onDelete(cuenta)} 
                            size="sm"
                            title="Eliminar cuenta"
                        />
                    </div>
                </div>
            </div>
        </Card>
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