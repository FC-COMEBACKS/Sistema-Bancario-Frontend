import React, { useState, useEffect } from 'react';
import { Input, Button, Select, Modal } from '../ui';
import { useMovimiento } from '../../shared/hooks/useMovimiento';
import { validateTransferAmount } from '../../shared/validators';
import { useCuenta } from '../../shared/hooks/useCuenta';
import '../../pages/movimiento/movimientoPage.css';
import './MovimientoModals.css';

const TransferForm = ({ isOpen, onClose, onSuccess, isStandalone = false }) => {
    const [formData, setFormData] = useState({
        cuentaOrigen: '',
        cuentaDestino: '',
        monto: '',
        descripcion: ''
    });
    const [errors, setErrors] = useState({});
    const [tipoTransferencia, setTipoTransferencia] = useState('externa');
    
    const {
        cuentas: cuentasUsuario,
        cuentasAgregadas,
        fetchCuentasDelUsuario,
        fetchCuentasAgregadas,
        loading: cuentasLoading
    } = useCuenta();
    const cuentasAgregadasOptions = cuentasAgregadas && Array.isArray(cuentasAgregadas) 
        ? cuentasAgregadas.map(cuenta => ({
            value: cuenta.numeroCuenta,
            label: `${cuenta.numeroCuenta} - ${cuenta.usuario?.nombre || 'Sin nombre'}`
        }))
        : [];

    const noCuentasPropias = !cuentasUsuario || !Array.isArray(cuentasUsuario) || cuentasUsuario.length === 0;
    const noCuentasAgregadas = !cuentasAgregadas || !Array.isArray(cuentasAgregadas) || cuentasAgregadas.length === 0;

    const { handleTransferencia, loading, error, success, clearMessages } = useMovimiento();

    const cuentasOptions = cuentasUsuario && Array.isArray(cuentasUsuario) 
        ? cuentasUsuario.map(cuenta => {
            const numeroCuenta = cuenta.numeroCuenta || cuenta.numero || 'Sin número';
            const saldo = cuenta.saldo || 0;
            return {
                value: numeroCuenta,
                label: `${numeroCuenta} - Saldo: Q${saldo.toLocaleString()}`
            };
        })
        : [];

    const cuentasDestinoOptions = cuentasUsuario && Array.isArray(cuentasUsuario)
        ? cuentasUsuario
            .filter(cuenta => {
                const numeroCuenta = cuenta.numeroCuenta || cuenta.numero;
                return numeroCuenta !== formData.cuentaOrigen;
            })
            .map(cuenta => {
                const numeroCuenta = cuenta.numeroCuenta || cuenta.numero || 'Sin número';
                const tipo = cuenta.tipo || 'Cuenta';
                const saldo = cuenta.saldo || 0;
                return {
                    value: numeroCuenta,
                    label: `${tipo} - ${numeroCuenta} (Saldo: Q${saldo.toLocaleString()})`
                };
            })
        : [];

    const tieneMultiplesCuentas = cuentasUsuario && Array.isArray(cuentasUsuario) && cuentasUsuario.length >= 2;

   
    useEffect(() => {
        if (!isOpen) return;
        
        fetchCuentasDelUsuario();
        fetchCuentasAgregadas();
    }, [isOpen, fetchCuentasDelUsuario, fetchCuentasAgregadas]);

    useEffect(() => {
        if (success) {
            onSuccess && onSuccess();
            resetForm();
            onClose();
            clearMessages();
        }
    }, [success, onSuccess, onClose, clearMessages]);

    const resetForm = () => {
        setFormData({
            cuentaOrigen: '',
            cuentaDestino: '',
            monto: '',
            descripcion: ''
        });
        setErrors({});
        if (!tieneMultiplesCuentas) {
            setTipoTransferencia('externa');
        }
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

    const handleTipoTransferenciaChange = (tipo) => {
        setTipoTransferencia(tipo);
        setFormData(prev => ({
            ...prev,
            cuentaDestino: ''
        }));
        if (errors.cuentaDestino) {
            setErrors(prev => ({
                ...prev,
                cuentaDestino: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.cuentaOrigen) {
            newErrors.cuentaOrigen = 'Selecciona una cuenta de origen';
        }

        if (!formData.cuentaDestino) {
            if (tipoTransferencia === 'propia') {
                newErrors.cuentaDestino = 'Selecciona una cuenta destino';
            } else {
                newErrors.cuentaDestino = 'Ingresa el número de cuenta destino';
            }
        }

        if (formData.cuentaOrigen === formData.cuentaDestino) {
            newErrors.cuentaDestino = 'La cuenta destino debe ser diferente a la origen';
        }

        const cuentaOrigen = cuentasUsuario && Array.isArray(cuentasUsuario) 
            ? cuentasUsuario.find(c => {
                const numeroCuenta = c.numeroCuenta || c.numero;
                return numeroCuenta === formData.cuentaOrigen;
            })
            : null;
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



    const formContent = (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selector de tipo de transferencia */}
            {tieneMultiplesCuentas && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de transferencia
                    </label>
                    <div className="flex gap-2 mb-3" style={{ zIndex: 10, position: 'relative' }}>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleTipoTransferenciaChange('propia');
                            }}
                            style={{ 
                                border: 'none',
                                outline: 'none',
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                                MozUserSelect: 'none',
                                msUserSelect: 'none'
                            }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                                tipoTransferencia === 'propia'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Entre mis cuentas
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleTipoTransferenciaChange('externa');
                            }}
                            style={{ 
                                border: 'none',
                                outline: 'none',
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                                MozUserSelect: 'none',
                                msUserSelect: 'none'
                            }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                                tipoTransferencia === 'externa'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            A cuenta externa
                        </button>
                    </div>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuenta de origen
                </label>
                <Select
                    name="cuentaOrigen"
                    value={formData.cuentaOrigen}
                    onChange={e => handleInputChange('cuentaOrigen', e.target.value)}
                    options={[
                        { value: '', label: 'Selecciona una cuenta' },
                        ...cuentasOptions
                    ]}
                    error={errors.cuentaOrigen}
                    disabled={loading || cuentasLoading || noCuentasPropias}
                />
                {noCuentasPropias && (
                    <p className="text-xs text-red-500 mt-1">No tienes cuentas propias registradas. Solicita la creación de una cuenta.</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuenta destino
                </label>
                {tipoTransferencia === 'propia' ? (
                    <Select
                        name="cuentaDestino"
                        value={formData.cuentaDestino}
                        onChange={e => handleInputChange('cuentaDestino', e.target.value)}
                        options={[
                            { value: '', label: 'Selecciona cuenta destino' },
                            ...cuentasDestinoOptions
                        ]}
                        error={errors.cuentaDestino}
                        disabled={loading || cuentasLoading || cuentasDestinoOptions.length === 0}
                    />
                ) : (
                    <>
                        {noCuentasAgregadas ? (
                            <Input
                                type="text"
                                value={formData.cuentaDestino}
                                onChange={e => handleInputChange('cuentaDestino', e.target.value)}
                                placeholder="Ingresa el número de cuenta destino"
                                error={errors.cuentaDestino}
                                disabled={loading || cuentasLoading}
                            />
                        ) : (
                            <Select
                                name="cuentaDestino"
                                value={formData.cuentaDestino}
                                onChange={e => handleInputChange('cuentaDestino', e.target.value)}
                                options={[
                                    { value: '', label: 'Selecciona una cuenta agregada' },
                                    ...cuentasAgregadasOptions
                                ]}
                                error={errors.cuentaDestino}
                                disabled={loading || cuentasLoading}
                            />
                        )}
                        {noCuentasAgregadas && (
                            <p className="text-xs text-blue-500 mt-1">No tienes cuentas agregadas. Puedes ingresar el número manualmente o agregar una desde "Mis Cuentas".</p>
                        )}
                    </>
                )}
                
                {tipoTransferencia === 'propia' && cuentasDestinoOptions.length === 0 && (
                    <p className="text-xs text-orange-500 mt-1">
                        Necesitas al menos 2 cuentas para transferir entre cuentas propias.
                    </p>
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
                    {...(loading ? { loading: true } : {})}
                    disabled={loading || noCuentasPropias}
                >
                    Transferir
                </Button>
            </div>
        </form>
    );

    if (isStandalone) {
        return (
            <div className="transfer-form-standalone">
                {formContent}
            </div>
        );
    }

    return (
        <>
            {isOpen && (
                <Modal isOpen={isOpen} onClose={handleClose} title="Realizar Transferencia">
                    {formContent}
                </Modal>
            )}
        </>
    );
};

export default TransferForm;