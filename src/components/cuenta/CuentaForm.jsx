import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Select, Button, Card } from '../ui';
import { useUser } from '../../shared/hooks';

const CuentaForm = ({ cuenta, onSubmit, onCancel, loading = false, isClientView = false }) => {
    const { users, fetchUsers } = useUser();
    const [form, setForm] = useState({
        usuarioId: '',
        tipo: '',
        activa: true
    });

    useEffect(() => {
        if (cuenta) {
            setForm({
                usuarioId: cuenta.usuario?.uid || '',
                tipo: cuenta.tipo || '',
                activa: cuenta.activa !== undefined ? cuenta.activa : true
            });
        }
        fetchUsers();
    }, [cuenta, fetchUsers]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            const formData = {
                usuario: form.usuarioId,
                tipo: form.tipo,
                activa: form.activa 
            };
            console.log('Enviando datos del formulario:', formData);
            onSubmit(formData);
        }
    };

    const tipoOptions = [
        { value: '', label: 'Selecciona un tipo' },
        { value: 'AHORROS', label: 'Ahorros' },
        { value: 'CORRIENTE', label: 'Corriente' }
    ];

    const usuarioOptions = [
        { value: '', label: 'Selecciona un usuario' },
        ...users.map(user => ({
            value: user.uid || user._id,
            label: `${user.nombre} (${user.username})`
        }))
    ];

    return (
        <Card>
            <div className="space-y-4">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900">
                        {cuenta ? 'Editar Cuenta' : 'Nueva Cuenta'}
                    </h2>
                    <p className="text-gray-600">
                        {cuenta ? 'Modifica los datos de la cuenta' : 'Completa los datos para crear una nueva cuenta'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!cuenta && !isClientView && (
                        <Select
                            label="Usuario"
                            name="usuarioId"
                            value={form.usuarioId}
                            onChange={handleChange}
                            options={usuarioOptions}
                            required
                        />
                    )}

                    <Select
                        label="Tipo de Cuenta"
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                        options={tipoOptions}
                        required
                        disabled={isClientView}
                    />

                    {cuenta && !isClientView && (
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="activa"
                                name="activa"
                                checked={form.activa}
                                onChange={handleChange}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="activa" className="text-sm font-medium text-gray-700">
                                Cuenta activa
                            </label>
                        </div>
                    )}

                    {isClientView && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                            <p className="text-sm text-yellow-800">
                                <strong>Nota:</strong> Solo puedes ver los detalles de tu cuenta. 
                                Para cambios importantes, contacta con un administrador.
                            </p>
                        </div>
                    )}

                    <div className="flex space-x-2">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading || isClientView}
                            className="flex-1"
                        >
                            {loading ? 'Guardando...' : cuenta ? 'Actualizar' : 'Crear Cuenta'}
                        </Button>
                        
                        {onCancel && (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={onCancel}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </Card>
    );
};

CuentaForm.propTypes = {
    cuenta: PropTypes.shape({
        cid: PropTypes.string,
        tipo: PropTypes.string,
        saldo: PropTypes.number,
        activa: PropTypes.bool,
        usuario: PropTypes.shape({
            uid: PropTypes.string,
            nombre: PropTypes.string,
            username: PropTypes.string
        })
    }),
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    loading: PropTypes.bool,
    isClientView: PropTypes.bool
};

export default CuentaForm;