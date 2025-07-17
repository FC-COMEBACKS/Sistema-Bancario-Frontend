import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

export const FavoritoForm = ({ isOpen, onClose, onSubmit, loading, editingFavorito = null }) => {
    const [formData, setFormData] = useState({
        numeroCuenta: '',
        alias: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editingFavorito) {
            setFormData({
                numeroCuenta: editingFavorito.numeroCuenta || '',
                alias: editingFavorito.alias || ''
            });
        } else {
            setFormData({
                numeroCuenta: '',
                alias: ''
            });
        }
        setErrors({});
    }, [editingFavorito, isOpen]);

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

        if (!formData.numeroCuenta.trim()) {
            newErrors.numeroCuenta = 'El número de cuenta es requerido';
        } else if (formData.numeroCuenta.length < 10) {
            newErrors.numeroCuenta = 'El número de cuenta debe tener al menos 10 dígitos';
        }

        if (!formData.alias.trim()) {
            newErrors.alias = 'El alias es requerido';
        } else if (formData.alias.length < 2) {
            newErrors.alias = 'El alias debe tener al menos 2 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingFavorito ? 'Editar Favorito' : 'Agregar Favorito'}
            className="favorito-form-modal"
        >
            <form onSubmit={handleSubmit} className="favorito-form">
                <div className="form-group">
                    <label htmlFor="numeroCuenta">Número de Cuenta</label>
                    <Input
                        id="numeroCuenta"
                        type="text"
                        value={formData.numeroCuenta}
                        onChange={(e) => handleChange('numeroCuenta', e.target.value)}
                        placeholder="Ingrese el número de cuenta"
                        disabled={editingFavorito}
                        error={errors.numeroCuenta}
                        required
                    />
                    {errors.numeroCuenta && (
                        <span className="error-text">{errors.numeroCuenta}</span>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="alias">Alias</label>
                    <Input
                        id="alias"
                        type="text"
                        value={formData.alias}
                        onChange={(e) => handleChange('alias', e.target.value)}
                        placeholder="Ej: Hermano, Mamá, Trabajo..."
                        error={errors.alias}
                        required
                    />
                    {errors.alias && (
                        <span className="error-text">{errors.alias}</span>
                    )}
                </div>

                <div className="form-actions">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : editingFavorito ? 'Actualizar' : 'Agregar'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};