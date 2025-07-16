import React, { useState } from 'react';
import { Modal, Input, Button } from '../ui';
import './CompraForm.css';

const CompraForm = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    producto = null,
    loading = false 
}) => {
    const [formData, setFormData] = useState({
        cantidad: 1
    });

    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.cantidad || formData.cantidad <= 0) {
            newErrors.cantidad = 'La cantidad debe ser mayor a 0';
        }

        if (producto?.stock !== undefined && formData.cantidad > producto.stock) {
            newErrors.cantidad = `Stock insuficiente. Solo hay ${producto.stock} unidades disponibles`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const submitData = {
            productoId: producto.pid || producto._id,
            cantidad: parseInt(formData.cantidad),
            descripcion: `Compra de: ${producto.nombre}`
        };

        onSubmit(submitData);
    };

    const calcularTotal = () => {
        const cantidad = parseInt(formData.cantidad) || 0;
        const precio = parseFloat(producto?.precio) || 0;
        return cantidad * precio;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Comprar Producto/Servicio">
            {producto && (
                <div className="compra-form">
                    <div className="producto-info">
                        <h4>{producto.nombre}</h4>
                        <p>{producto.descripcion}</p>
                        <div className="precio-info">
                            <span>Precio unitario: Q{producto.precio}</span>
                            {producto.stock !== undefined && (
                                <span className={`stock-info ${producto.stock <= (producto.stockMinimo || 5) ? 'stock-bajo' : ''}`}>
                                    Stock disponible: {producto.stock} unidades
                                    {producto.stock <= (producto.stockMinimo || 5) && (
                                        <span className="stock-warning"> (Stock bajo)</span>
                                    )}
                                </span>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Cantidad *"
                            type="number"
                            min="1"
                            max={producto.stock || undefined}
                            value={formData.cantidad}
                            onChange={(e) => handleChange('cantidad', e.target.value)}
                            error={errors.cantidad}
                            disabled={loading || (producto.stock !== undefined && producto.stock === 0)}
                        />

                        {producto.stock === 0 && (
                            <div className="sin-stock">
                                <p style={{color: 'red', fontSize: '14px'}}>Producto sin stock disponible</p>
                            </div>
                        )}

                        <div className="total-compra">
                            <strong>Total a pagar: Q{calcularTotal().toFixed(2)}</strong>
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
                                disabled={loading || (producto.stock !== undefined && producto.stock === 0)}
                            >
                                {loading ? 'Procesando...' : 
                                 producto.stock === 0 ? 'Sin Stock' : 'Confirmar Compra'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </Modal>
    );
};

export default CompraForm;
