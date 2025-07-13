import React, { useEffect } from 'react';
import { Button, Modal } from '../ui';
import { useMovimiento } from '../../shared/hooks/useMovimiento';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const RevertirForm = ({ isOpen, onClose, onSuccess, movimiento }) => {
    const { handleRevertirDeposito, loading, error, success } = useMovimiento();

    useEffect(() => {
        if (success) {
            onSuccess && onSuccess();
            onClose();
        }
    }, [success, onSuccess, onClose]);

    const handleRevertir = async () => {
        if (!movimiento?._id && !movimiento?.mid) {
            return;
        }

        await handleRevertirDeposito(movimiento._id || movimiento.mid);
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

    if (!movimiento) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Revertir Depósito">
            <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-sm font-medium text-yellow-800">
                            Advertencia
                        </h3>
                    </div>
                    <p className="text-sm text-yellow-700">
                        Esta acción no se puede deshacer. El depósito será revertido y el monto será deducido de la cuenta.
                    </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Detalles del depósito</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tipo:</span>
                            <span className="font-medium">{movimiento.tipo}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Monto:</span>
                            <span className="font-medium">{formatMonto(movimiento.monto)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Fecha:</span>
                            <span className="font-medium">{formatFecha(movimiento.fechaHora)}</span>
                        </div>
                        {movimiento.descripcion && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Descripción:</span>
                                <span className="font-medium">{movimiento.descripcion}</span>
                            </div>
                        )}
                        {movimiento.cuentaDestinoDetalle && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Cuenta:</span>
                                <span className="font-medium">{movimiento.cuentaDestinoDetalle.numeroCuenta}</span>
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="danger"
                        onClick={handleRevertir}
                        loading={loading}
                    >
                        Revertir Depósito
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default RevertirForm;