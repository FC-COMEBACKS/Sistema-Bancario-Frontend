import React, { useState, useEffect } from 'react';
import { Modal } from '../ui';

const ProductoForm = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    producto = null, 
    loading = false 
}) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        stockMinimo: '',
        disponible: true
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (producto) {
            setFormData({
                nombre: producto.nombre || '',
                descripcion: producto.descripcion || '',
                precio: producto.precio || '',
                stock: producto.stock || '',
                stockMinimo: producto.stockMinimo || '',
                disponible: producto.disponible !== undefined ? producto.disponible : true
            });
        } else {
            setFormData({
                nombre: '',
                descripcion: '',
                precio: '',
                stock: '',
                stockMinimo: '',
                disponible: true
            });
        }
        setErrors({});
    }, [producto, isOpen]);
    
    if (!isOpen) {
        return null;
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }

        if (!formData.precio || formData.precio <= 0) {
            newErrors.precio = 'El precio debe ser mayor a 0';
        }

        if (formData.stock === '' || formData.stock < 0) {
            newErrors.stock = 'El stock debe ser mayor o igual a 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Formulario enviado');
        console.log('Datos del formulario:', formData);
        
        if (!validateForm()) {
            console.log('Validación falló');
            return;
        }

        const submitData = {
            ...formData,
            precio: parseFloat(formData.precio),
            stock: parseInt(formData.stock) || 0,
            stockMinimo: parseInt(formData.stockMinimo) || 5
        };

        console.log('Datos a enviar:', submitData);
        onSubmit(submitData);
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={producto ? "Editar Producto" : "Crear Producto"}
            size="lg"
        >
            <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Nombre del producto *
                    </label>
                    <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => handleChange('nombre', e.target.value)}
                        disabled={loading}
                        placeholder="Ej: Tarjeta de crédito premium"
                        style={{ 
                            width: '100%', 
                            padding: '10px', 
                            border: errors.nombre ? '2px solid red' : '1px solid #ccc', 
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                    />
                    {errors.nombre && (
                        <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                            {errors.nombre}
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Precio *
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.precio}
                        onChange={(e) => handleChange('precio', e.target.value)}
                        disabled={loading}
                        placeholder="0.00"
                        style={{ 
                            width: '100%', 
                            padding: '10px', 
                            border: errors.precio ? '2px solid red' : '1px solid #ccc', 
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                    />
                    {errors.precio && (
                        <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                            {errors.precio}
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Stock disponible *
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => handleChange('stock', e.target.value)}
                        disabled={loading}
                        placeholder="0"
                        style={{ 
                            width: '100%', 
                            padding: '10px', 
                            border: errors.stock ? '2px solid red' : '1px solid #ccc', 
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                    />
                    {errors.stock && (
                        <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                            {errors.stock}
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Stock mínimo
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={formData.stockMinimo}
                        onChange={(e) => handleChange('stockMinimo', e.target.value)}
                        disabled={loading}
                        placeholder="5"
                        style={{ 
                            width: '100%', 
                            padding: '10px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                    />
                    <div style={{ color: '#666', fontSize: '12px', marginTop: '5px' }}>
                        Cantidad mínima para mostrar alerta de stock bajo
                    </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Descripción
                    </label>
                    <textarea
                        value={formData.descripcion}
                        onChange={(e) => handleChange('descripcion', e.target.value)}
                        disabled={loading}
                        placeholder="Descripción del producto o servicio"
                        style={{ 
                            width: '100%', 
                            padding: '10px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px',
                            minHeight: '80px',
                            fontSize: '14px',
                            resize: 'vertical'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={formData.disponible}
                            onChange={(e) => handleChange('disponible', e.target.checked)}
                            disabled={loading}
                            style={{ marginRight: '10px', transform: 'scale(1.2)' }}
                        />
                        <span style={{ fontWeight: 'bold' }}>Producto disponible</span>
                    </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        style={{
                            padding: '10px 20px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            backgroundColor: 'white',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '4px',
                            backgroundColor: loading ? '#ccc' : '#007bff',
                            color: 'white',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}
                    >
                        {loading ? 'Guardando...' : (producto ? 'Actualizar Producto' : 'Crear Producto')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ProductoForm;
