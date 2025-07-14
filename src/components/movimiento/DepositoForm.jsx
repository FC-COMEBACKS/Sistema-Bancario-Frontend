import React, { useState, useEffect } from 'react';
import { Input, Button, Select, Modal } from '../ui';
import { useMovimiento } from '../../shared/hooks/useMovimiento';
import { useCuenta } from '../../shared/hooks/useCuenta';
import { validateAmount } from '../../shared/validators';

const DepositoForm = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        cuentaDestinoId: '',
        monto: '',
        descripcion: ''
    });
    const [errors, setErrors] = useState({});

    const { handleDeposito, loading, error, success, clearMessages } = useMovimiento();
    const { fetchCuentas, cuentas } = useCuenta();
    useEffect(() => {
        const loadCuentas = async () => {
            await fetchCuentas();
        };

        if (isOpen) {
            loadCuentas();
        }
    }, [isOpen, fetchCuentas]);

    useEffect(() => {
        if (success) {
            onSuccess && onSuccess();
            resetForm();
            onClose();
            if (typeof clearMessages === 'function') clearMessages();
        }
    }, [success, onSuccess, onClose, clearMessages]);

    const resetForm = () => {
        setFormData({
            cuentaDestinoId: '',
            monto: '',
            descripcion: ''
        });
        setErrors({});
    };

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.cuentaDestinoId) {
            newErrors.cuentaDestinoId = 'Selecciona una cuenta destino';
        }

        const montoValidation = validateAmount(formData.monto, 0.01);
        if (montoValidation !== true) {
            newErrors.monto = montoValidation;
        }

        if (!formData.descripcion || formData.descripcion.trim() === '') {
            newErrors.descripcion = 'La descripción es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const dataToSend = {
            ...formData,
            cuentaDestino: formData.cuentaDestinoId,
            monto: Number(formData.monto)
        };
        delete dataToSend.cuentaDestinoId;

        await handleDeposito(dataToSend);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const cuentasOptions = cuentas.map(cuenta => ({
        value: cuenta.numeroCuenta,
        label: `${cuenta.numeroCuenta} - ${cuenta.usuario?.nombre || 'Usuario'} - Saldo: Q${cuenta.saldo?.toLocaleString() || '0'}`
    }));

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Realizar Depósito">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cuenta destino
                    </label>
                    <Select
                        value={formData.cuentaDestinoId}
                        onChange={e => handleInputChange('cuentaDestinoId', e.target.value)}
                        options={[
                            { value: '', label: 'Selecciona una cuenta' },
                            ...cuentasOptions
                        ]}
                        error={errors.cuentaDestinoId}
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monto
                    </label>
                    <Input
                        type="number"
                        value={formData.monto}
                        onChange={(e) => handleInputChange('monto', e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        error={errors.monto}
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                    </label>
                    <Input
                        type="text"
                        value={formData.descripcion}
                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                        placeholder="Motivo del depósito"
                        error={errors.descripcion}
                        disabled={loading}
                    />
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
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                    >
                        Depositar
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default DepositoForm;