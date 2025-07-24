import React, { useState } from 'react';
import { Input, Button, Modal } from '../ui';
import { useMovimiento } from '../../shared/hooks/useMovimiento';
import '../../pages/movimiento/movimientoPage.css';
import './MovimientoModals.css';

const CreditoForm = ({ isOpen, onClose, onSuccess, isStandalone = false }) => {
    const { handleCredito, loading, error, success, clearMessages } = useMovimiento();
    const [monto, setMonto] = useState('');
    const [numeroCuenta, setNumeroCuenta] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearMessages();
        const creditoData = {
            cuentaDestino: numeroCuenta,
            monto: parseFloat(monto),
            descripcion
        };
        const ok = await handleCredito(creditoData);
        if (ok && onSuccess) onSuccess();
    };

    const handleClose = () => {
        setMonto('');
        setNumeroCuenta('');
        setDescripcion('');
        clearMessages();
        onClose();
    };

    const formContent = (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto
                </label>
                <Input
                    type="number"
                    value={monto}
                    onChange={e => setMonto(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    required
                    disabled={loading}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Cuenta
                </label>
                <Input
                    type="text"
                    value={numeroCuenta}
                    onChange={e => setNumeroCuenta(e.target.value)}
                    placeholder="Ingresa el número de cuenta"
                    required
                    disabled={loading}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                </label>
                <Input
                    type="text"
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                    placeholder="Motivo del crédito"
                    disabled={loading}
                />
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-600 text-sm">Crédito realizado correctamente</p>
                </div>
            )}

            <div className="modal-footer">
                <Button
                    type="button"
                    className="form-button secondary"
                    onClick={handleClose}
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    className="form-button primary"
                    loading={loading}
                >
                    Realizar Crédito
                </Button>
            </div>
        </form>
    );

    // Si es standalone (página independiente), renderizar sin modal
    if (isStandalone) {
        return (
            <div className="transfer-form-standalone">
                {formContent}
            </div>
        );
    }

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Nuevo Crédito">
            {formContent}
        </Modal>
    );
};

export default CreditoForm;
