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
        { value: '', label: '🔒 Selecciona un tipo de cuenta' },
        { value: 'AHORROS', label: '💰 Cuenta de Ahorros' },
        { value: 'CORRIENTE', label: '💳 Cuenta Corriente' },
        { value: 'NOMINA', label: '💼 Cuenta Nómina' }
    ];

    const usuarioOptions = [
        { value: '', label: '👤 Selecciona un usuario' },
        ...users.map(user => ({
            value: user.uid || user._id,
            label: `👤 ${user.nombre} (@${user.username})`
        }))
    ];

    return (
        <div className="cuenta-form-container">
            <div className="form-header">
                <div className="header-icon">
                    {cuenta ? '✏️' : '➕'}
                </div>
                <h2 className="form-title">
                    {cuenta ? 'Editar Cuenta Bancaria' : 'Nueva Cuenta Bancaria'}
                </h2>
                <p className="form-subtitle">
                    {cuenta ? 'Modifica los datos de la cuenta existente' : 'Completa la información para crear una nueva cuenta'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="cuenta-form">
                {!cuenta && !isClientView && (
                    <div className="form-group">
                        <label className="form-label">
                            👤 Usuario
                        </label>
                        <Select
                            name="usuarioId"
                            value={form.usuarioId}
                            onChange={handleChange}
                            options={usuarioOptions}
                            required
                            className="modern-select"
                        />
                    </div>
                )}

                <div className="form-group">
                    <label className="form-label">
                        🏦 Tipo de Cuenta
                    </label>
                    <Select
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                        options={tipoOptions}
                        required
                        disabled={isClientView}
                        className="modern-select"
                    />
                </div>

                {cuenta && !isClientView && (
                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                id="activa"
                                name="activa"
                                checked={form.activa}
                                onChange={handleChange}
                                className="modern-checkbox"
                            />
                            <span className="checkbox-text">
                                ✅ Cuenta activa y operativa
                            </span>
                        </label>
                    </div>
                )}

                {isClientView && (
                    <div className="info-notice">
                        <div className="notice-icon">ℹ️</div>
                        <div className="notice-content">
                            <strong>Información:</strong> Solo puedes visualizar los detalles de tu cuenta. 
                            Para realizar cambios, contacta con el soporte técnico del banco.
                        </div>
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="submit"
                        disabled={loading || isClientView}
                        className="btn-primary"
                    >
                        <span className="btn-icon">
                            {loading ? '⏳' : cuenta ? '💾' : '➕'}
                        </span>
                        {loading ? 'Guardando...' : cuenta ? 'Actualizar Cuenta' : 'Crear Cuenta'}
                    </button>
                    
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="btn-secondary"
                        >
                            <span className="btn-icon">↩️</span>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
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