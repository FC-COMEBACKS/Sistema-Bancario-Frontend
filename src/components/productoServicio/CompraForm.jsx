import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Select } from '../ui';
import { useCuenta } from '../../shared/hooks/useCuenta';
import './CompraForm.css';
import '../movimiento/MovimientoModals.css';

const CompraForm = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    producto = null,
    loading = false 
}) => {
    const { fetchCuentasDelUsuario, cuentas, loading: cuentasLoading } = useCuenta();
    
    const [formData, setFormData] = useState({
        cantidad: 1,
        cuentaId: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            console.log('CompraForm: Modal abierto, obteniendo cuentas...');
            fetchCuentasDelUsuario();
        }
    }, [isOpen, fetchCuentasDelUsuario]);

    useEffect(() => {
        console.log('CompraForm: Cuentas actualizadas:', cuentas);
        console.log('CompraForm: Tipo de cuentas:', typeof cuentas);
        console.log('CompraForm: Array.isArray(cuentas):', Array.isArray(cuentas));
        console.log('CompraForm: cuentas.length:', cuentas?.length);
        
        if (cuentas && Array.isArray(cuentas) && cuentas.length > 0) {
            console.log('CompraForm: Primera cuenta completa:', JSON.stringify(cuentas[0], null, 2));
            if (cuentas.length > 1) {
                console.log('CompraForm: Segunda cuenta completa:', JSON.stringify(cuentas[1], null, 2));
            }
        }
        
        if (cuentas && Array.isArray(cuentas) && cuentas.length > 0 && !formData.cuentaId) {
            const primercuenta = cuentas[0];
            const cuentaId = primercuenta.cid || primercuenta._id || primercuenta.id;
            if (cuentaId) {
                setFormData(prev => ({ ...prev, cuentaId: cuentaId }));
            }
        }
    }, [cuentas, formData.cuentaId]);

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                cantidad: 1,
                cuentaId: ''
            });
            setErrors({});
        }
    }, [isOpen]);


    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.cuentaId) {
            newErrors.cuentaId = 'Selecciona una cuenta';
        }

        if (!formData.cantidad || formData.cantidad <= 0) {
            newErrors.cantidad = 'La cantidad debe ser mayor a 0';
        }

        if (producto?.stock !== undefined && formData.cantidad > producto.stock) {
            newErrors.cantidad = `Stock insuficiente. Solo hay ${producto.stock} unidades disponibles`;
        }

        const cuentaSeleccionada = cuentas && Array.isArray(cuentas) ? 
            cuentas.find(cuenta => {
                const cuentaId = cuenta.cid || cuenta._id || cuenta.id;
                return cuentaId === formData.cuentaId;
            }) : null;
        const total = calcularTotal();
        
        if (cuentaSeleccionada && total > cuentaSeleccionada.saldo) {
            newErrors.saldo = `Saldo insuficiente. Saldo disponible: $${cuentaSeleccionada.saldo}`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const cuentaSeleccionada = cuentas && Array.isArray(cuentas) ? 
            cuentas.find(cuenta => {
                const cuentaId = cuenta.cid || cuenta._id || cuenta.id;
                return cuentaId === formData.cuentaId;
            }) : null;

        const submitData = {
            productoId: producto.pid || producto._id,
            cantidad: parseInt(formData.cantidad),
            numeroCuenta: cuentaSeleccionada?.numeroCuenta,
            descripcion: `Compra de: ${producto.nombre}`
        };

        console.log('Formulario - Enviando datos:', submitData);
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
                        <Select
                            label="Cuenta para débito *"
                            name="cuentaId"
                            value={formData.cuentaId}
                            onChange={(e) => handleChange('cuentaId', e.target.value)}
                            options={
                                cuentas && Array.isArray(cuentas) && cuentas.length > 0 
                                    ? cuentas.map((cuenta, index) => {
                                        console.log('CompraForm: Procesando cuenta para option:', cuenta);
                                        
                                        const cuentaId = cuenta.cid || cuenta._id || cuenta.id;
                                        const numeroCuenta = cuenta.numeroCuenta || cuenta.numero || `Cuenta ${index + 1}`;
                                        const tipo = cuenta.tipo || 'Cuenta';
                                        const saldo = cuenta.saldo || 0;
                                        
                                        if (!cuentaId) {
                                            console.error('CompraForm: No se encontró ID válido para cuenta:', cuenta);
                                            return null;
                                        }
                                        
                                        return {
                                            value: cuentaId,
                                            label: `${tipo} - ${numeroCuenta} (Saldo: Q${saldo})`
                                        };
                                    }).filter(Boolean)
                                    : []
                            }
                            error={errors.cuentaId || errors.saldo}
                            disabled={loading || cuentasLoading}
                            placeholder={cuentasLoading ? 'Cargando cuentas...' : 'Selecciona una cuenta'}
                        />

                        {!cuentasLoading && (!cuentas || !Array.isArray(cuentas) || cuentas.length === 0) && (
                            <div className="sin-cuentas" style={{
                                background: '#fef2f2',
                                border: '1px solid #fecaca',
                                borderRadius: '4px',
                                padding: '8px',
                                marginBottom: '16px'
                            }}>
                                <p style={{color: '#dc2626', fontSize: '14px', margin: 0}}>
                                    No tienes cuentas activas disponibles para realizar la compra.
                                </p>
                            </div>
                        )}

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

                        <div className="modal-footer">
                            <Button
                                type="button"
                                className="form-button secondary"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="form-button primary"
                                disabled={loading || 
                                         (producto.stock !== undefined && producto.stock === 0) || 
                                         (!cuentas || !Array.isArray(cuentas) || cuentas.length === 0) || 
                                         !formData.cuentaId}
                            >
                                {loading ? 'Procesando...' : 
                                 producto.stock === 0 ? 'Sin Stock' : 
                                 (!cuentas || !Array.isArray(cuentas) || cuentas.length === 0) ? 'Sin Cuentas' : 'Confirmar Compra'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </Modal>
    );
};

export default CompraForm;
