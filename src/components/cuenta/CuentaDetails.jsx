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

    return (
        <Card>
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Detalles de la Cuenta</h2>
                    <p className="text-gray-600">Información completa de la cuenta bancaria</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-700">Número de Cuenta</h3>
                        <p className="text-lg font-mono bg-gray-50 px-3 py-2 rounded">{cuenta.numeroCuenta}</p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-700">Tipo de Cuenta</h3>
                        <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                            cuenta.tipo === 'AHORROS' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                        }`}>
                            {cuenta.tipo}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-700">Saldo Actual</h3>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(cuenta.saldo)}</p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-700">Estado</h3>
                        <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                            cuenta.activa 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                        }`}>
                            {cuenta.activa ? 'Activa' : 'Inactiva'}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-700">Total Ingresos</h3>
                        <p className="text-lg font-semibold text-green-500">{formatCurrency(cuenta.ingresos || 0)}</p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-700">Total Egresos</h3>
                        <p className="text-lg font-semibold text-red-500">{formatCurrency(cuenta.egresos || 0)}</p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-700">Fecha de Creación</h3>
                        <p className="text-gray-600">{formatDate(cuenta.fechaCreacion)}</p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-700">ID de Cuenta</h3>
                        <p className="text-sm text-gray-500 font-mono">{cuenta.cid}</p>
                    </div>
                </div>

                {cuenta.usuario && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-700 mb-2">Información del Usuario</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Nombre</p>
                                <p className="font-medium">{cuenta.usuario.nombre}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Username</p>
                                <p className="font-medium">{cuenta.usuario.username}</p>
                            </div>
                        </div>
                    </div>
                )}

                {cuenta.ultimosMovimientos && cuenta.ultimosMovimientos.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-700 mb-2">Últimos Movimientos</h3>
                        <div className="space-y-2">
                            {cuenta.ultimosMovimientos.map((movimiento, index) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <div>
                                        <p className="font-medium">{movimiento.tipo}</p>
                                        <p className="text-sm text-gray-600">{movimiento.descripcion}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-semibold ${
                                            movimiento.tipo === 'INGRESO' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {formatCurrency(movimiento.monto)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(movimiento.fechaHora)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex space-x-2">
                    {onEdit && (
                        <Button
                            variant="primary"
                            onClick={() => onEdit(cuenta)}
                            disabled={loading}
                        >
                            Editar Cuenta
                        </Button>
                    )}
                    
                    {onClose && (
                        <Button
                            variant="secondary"
                            onClick={onClose}
                        >
                            Cerrar
                        </Button>
                    )}
                </div>
            </div>
        </Card>
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
