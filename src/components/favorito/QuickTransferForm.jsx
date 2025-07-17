import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

export const QuickTransferForm = ({ isOpen, onClose, favorito, onTransfer, loading }) => {
    const [formData, setFormData] = useState({
        monto: '',
        descripcion: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.monto) {
            newErrors.monto = 'El monto es requerido';
        } else if (parseFloat(formData.monto) <= 0) {
            newErrors.monto = 'El monto debe ser mayor a 0';
        } else if (parseFloat(formData.monto) > 2000) {
            newErrors.monto = 'El monto no puede ser mayor a Q2000';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onTransfer({
                favoritoId: favorito._id,
                monto: parseFloat(formData.monto),
                descripcion: formData.descripcion || `Transferencia a ${favorito.alias}`
            });
        }
    };

    const handleClose = () => {
        setFormData({ monto: '', descripcion: '' });
        setErrors({});
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Transferencia Rápida"
            className="quick-transfer-modal"
        >
            <div className="transfer-info">
                <div className="transfer-destination">
                    <h3>Transferir a:</h3>
                    <div className="destination-details">
                        <p><strong>{favorito?.alias}</strong></p>
                        <p>Cuenta: {favorito?.numeroCuenta}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="quick-transfer-form">
                <div className="form-group">
                    <label htmlFor="monto">Monto (Q)</label>
                    <Input
                        id="monto"
                        type="number"
                        step="0.01"
                        min="0.01"
                        max="2000"
                        value={formData.monto}
                        onChange={(e) => handleChange('monto', e.target.value)}
                        placeholder="0.00"
                        error={errors.monto}
                        required
                    />
                    {errors.monto && (
                        <span className="error-text">{errors.monto}</span>
                    )}
                    <small className="form-hint">Máximo Q2000 por transferencia</small>
                </div>

                <div className="form-group">
                    <label htmlFor="descripcion">Descripción (Opcional)</label>
                    <Input
                        id="descripcion"
                        type="text"
                        value={formData.descripcion}
                        onChange={(e) => handleChange('descripcion', e.target.value)}
                        placeholder={`Transferencia a ${favorito?.alias}`}
                        maxLength={100}
                    />
                </div>

                <div className="form-actions">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                    >
                        {loading ? 'Transfiriendo...' : 'Transferir'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};