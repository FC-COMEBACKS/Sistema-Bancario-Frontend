import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const MovimientoItem = ({ movimiento, onClick }) => {
    const getTipoColor = (tipo) => {
        switch (tipo) {
            case 'TRANSFERENCIA':
                return 'bg-blue-100 text-blue-800';
            case 'DEPOSITO':
                return 'bg-green-100 text-green-800';
            case 'COMPRA':
                return 'bg-purple-100 text-purple-800';
            case 'CREDITO':
                return 'bg-yellow-100 text-yellow-800';
            case 'CANCELACION':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTipoIcon = (tipo) => {
        switch (tipo) {
            case 'TRANSFERENCIA':
                return '↔️';
            case 'DEPOSITO':
                return '⬇️';
            case 'COMPRA':
                return '🛒';
            case 'CREDITO':
                return '💳';
            case 'CANCELACION':
                return '❌';
            default:
                return '📄';
        }
    };

    const formatFecha = (fecha) => {
        try {
            return format(new Date(fecha), 'dd/MM/yyyy HH:mm', { locale: es });
        } catch {
            return 'Fecha inválida';
        }
    };

    const formatMonto = (monto) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ'
        }).format(monto);
    };

    return (
        <div 
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onClick && onClick(movimiento)}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTipoIcon(movimiento.tipo)}</span>
                    <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTipoColor(movimiento.tipo)}`}>
                            {movimiento.tipo}
                        </span>
                        {movimiento.reversed && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                REVERTIDO
                            </span>
                        )}
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                        {formatMonto(movimiento.monto)}
                    </p>
                    <p className="text-sm text-gray-500">
                        {formatFecha(movimiento.fechaHora)}
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                {movimiento.descripcion && (
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">Descripción:</span> {movimiento.descripcion}
                    </p>
                )}

                {movimiento.cuentaOrigenDetalle && (
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">Cuenta origen:</span> {movimiento.cuentaOrigenDetalle.numeroCuenta}
                        {movimiento.cuentaOrigenDetalle.titular && (
                            <span className="text-gray-500"> - {movimiento.cuentaOrigenDetalle.titular}</span>
                        )}
                    </p>
                )}

                {movimiento.cuentaDestinoDetalle && (
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">Cuenta destino:</span> {movimiento.cuentaDestinoDetalle.numeroCuenta}
                        {movimiento.cuentaDestinoDetalle.titular && (
                            <span className="text-gray-500"> - {movimiento.cuentaDestinoDetalle.titular}</span>
                        )}
                    </p>
                )}

                {movimiento.productoServicio && (
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">Producto:</span> {movimiento.productoServicio.nombre}
                    </p>
                )}
            </div>
        </div>
    );
};

export default MovimientoItem;