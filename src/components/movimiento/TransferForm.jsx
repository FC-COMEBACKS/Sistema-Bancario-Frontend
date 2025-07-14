import React, { useState, useEffect } from 'react';
import { Input, Button, Select, Modal } from '../ui';
import { useMovimiento } from '../../shared/hooks/useMovimiento';
import { validateTransferAmount } from '../../shared/validators';
import { useCuenta } from '../../shared/hooks/useCuenta';




const TransferForm = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        cuentaOrigen: '',
        cuentaDestino: '',
        monto: '',
        descripcion: ''
    });
    const [errors, setErrors] = useState({});
    const {
        cuentas: cuentasUsuario,
        cuentasAgregadas,
        fetchCuentaByUsuario,
        fetchCuentasAgregadas
    } = useCuenta();
    const cuentasAgregadasOptions = cuentasAgregadas.map(cuenta => ({
        value: cuenta.numeroCuenta,
        label: `${cuenta.numeroCuenta} - ${cuenta.usuario?.nombre || 'Sin nombre'}`
    }));

    const noCuentasPropias = cuentasUsuario.length === 0;
    const noCuentasAgregadas = cuentasAgregadas.length === 0;

    const { handleTransferencia, loading, error, success, clearMessages } = useMovimiento();

    const cuentasOptions = cuentasUsuario.map(cuenta => ({
        value: cuenta.numeroCuenta,
        label: `${cuenta.numeroCuenta} - Saldo: Q${cuenta.saldo?.toLocaleString() || '0'}`
    }));

   
    useEffect(() => {
        if (!isOpen) return;
        const userDetails = localStorage.getItem('user');
        if (!userDetails) return;
        const user = JSON.parse(userDetails);
        const userId = user.uid || user._id || user.id;
        if (userId) {
            fetchCuentaByUsuario(userId);
            fetchCuentasAgregadas();
        }
    }, [isOpen, fetchCuentaByUsuario, fetchCuentasAgregadas]);


    useEffect(() => {
        if (success) {
            onSuccess && onSuccess();
            resetForm();
            onClose();
            clearMessages();
        }
    }, [success, onSuccess, onClose, clearMessages]);

    useEffect(() => {
    }, [cuentasUsuario, cuentasOptions]);

    const resetForm = () => {
        setFormData({
            cuentaOrigen: '',
            cuentaDestino: '',
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

        if (!formData.cuentaOrigen) {
            newErrors.cuentaOrigen = 'Selecciona una cuenta de origen';
        }

        if (!formData.cuentaDestino) {
            newErrors.cuentaDestino = 'Ingresa el número de cuenta destino';
        }

        if (formData.cuentaOrigen === formData.cuentaDestino) {
            newErrors.cuentaDestino = 'La cuenta destino debe ser diferente a la origen';
        }


        const cuentaOrigen = cuentasUsuario.find(c => c.numeroCuenta === formData.cuentaOrigen);
        const montoValidation = validateTransferAmount(
            formData.monto,
            cuentaOrigen?.saldo,
            1,
            2000 
        );

        if (montoValidation !== true) {
            newErrors.monto = montoValidation;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        await handleTransferencia({
            ...formData,
            monto: Number(formData.monto)
        });
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };



    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Realizar Transferencia">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cuenta de origen
                    </label>
                    <Select
                        value={formData.cuentaOrigen}
                        onChange={e => handleInputChange('cuentaOrigen', e.target.value)}
                        options={[
                            { value: '', label: 'Selecciona una cuenta' },
                            ...cuentasOptions
                        ]}
                        error={errors.cuentaOrigen}
                        disabled={loading || noCuentasPropias}
                    />
                    {noCuentasPropias && (
                        <p className="text-xs text-red-500 mt-1">No tienes cuentas propias registradas. Solicita la creación de una cuenta.</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cuenta destino
                    </label>
                    {noCuentasAgregadas ? (
                        <Input
                            type="text"
                            value={formData.cuentaDestino}
                            onChange={e => handleInputChange('cuentaDestino', e.target.value)}
                            placeholder="Ingresa el número de cuenta destino"
                            error={errors.cuentaDestino}
                            disabled={loading}
                        />
                    ) : (
                        <Select
                            value={formData.cuentaDestino}
                            onChange={e => handleInputChange('cuentaDestino', e.target.value)}
                            options={[
                                { value: '', label: 'Selecciona una cuenta agregada' },
                                ...cuentasAgregadasOptions
                            ]}
                            error={errors.cuentaDestino}
                            disabled={loading}
                        />
                    )}
                    {noCuentasAgregadas && (
                        <p className="text-xs text-blue-500 mt-1">No tienes cuentas agregadas. Puedes ingresar el número manualmente o agregar una desde "Mis Cuentas".</p>
                    )}
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
                        max="2000"
                        error={errors.monto}
                        disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Límite máximo por transacción: Q2,000
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción (opcional)
                    </label>
                    <Input
                        type="text"
                        value={formData.descripcion}
                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                        placeholder="Motivo de la transferencia"
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
                        {...(loading ? { loading: true } : {})}
                        disabled={loading || noCuentasPropias}
                    >
                        Transferir
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default TransferForm;