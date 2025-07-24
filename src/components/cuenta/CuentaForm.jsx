import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Select, Button, Card } from '../ui';
import { useUser } from '../../shared/hooks';
import '../movimiento/MovimientoModals.css';

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

    return (
        <div className="modal-container cuenta-form-modal">
            <div className="modal-header">
                <h3 className="modal-title">
                    {cuenta ? '✏️ Editar Cuenta Bancaria' : '➕ Nueva Cuenta Bancaria'}
                </h3>
                <p className="modal-subtitle">
                    {cuenta ? 'Modifica los datos de la cuenta existente' : 'Completa la información para crear una nueva cuenta'}
                </p>
            </div>

            <div className="modal-body">
                <form onSubmit={handleSubmit} className="form-grid">
                    {!cuenta && !isClientView && (
                        <div className="form-group">
                            <label className="form-label">
                                👤 Usuario
                            </label>
                            <select
                                name="usuarioId"
                                value={form.usuarioId}
                                onChange={handleChange}
                                required
                                className="form-select"
                            >
                                <option value="">👤 Selecciona un usuario</option>
                                {users.map(user => (
                                    <option 
                                        key={user.uid || user._id} 
                                        value={user.uid || user._id}
                                    >
                                        👤 {user.nombre} (@{user.username})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">
                            🏦 Tipo de Cuenta
                        </label>
                        <select
                            name="tipo"
                            value={form.tipo}
                            onChange={handleChange}
                            required
                            disabled={isClientView}
                            className="form-select"
                        >
                            <option value="">🔒 Selecciona un tipo de cuenta</option>
                            <option value="AHORROS">💰 Cuenta de Ahorros</option>
                            <option value="CORRIENTE">💳 Cuenta Corriente</option>
                            <option value="NOMINA">💼 Cuenta Nómina</option>
                        </select>
                    </div>

                    {cuenta && !isClientView && (
                        <div className="form-group">
                            <label className="checkbox-container">
                                <input
                                    type="checkbox"
                                    id="activa"
                                    name="activa"
                                    checked={form.activa}
                                    onChange={handleChange}
                                    className="form-checkbox"
                                />
                                <span className="checkbox-label">✅ Cuenta activa y operativa</span>
                            </label>
                        </div>
                    )}

                    {isClientView && (
                        <div className="alert info">
                            <div className="alert-icon">ℹ️</div>
                            <div>
                                <strong>Información:</strong> Solo puedes visualizar los detalles de tu cuenta. 
                                Para realizar cambios, contacta con el soporte técnico del banco.
                            </div>
                        </div>
                    )}
                </form>
            </div>

            <div className="modal-footer">
                <Button
                    type="button"
                    onClick={onCancel}
                    variant="outline"
                    className="form-button secondary"
                >
                    ↩️ Cancelar
                </Button>
                <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading || isClientView}
                    variant="primary"
                    className="form-button primary"
                >
                    {loading ? '⏳ Guardando...' : cuenta ? '💾 Actualizar Cuenta' : '➕ Crear Cuenta'}
                </Button>
            </div>
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