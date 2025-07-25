import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import { useDivisasManagement } from '../../shared/hooks/useDivisasManagement';
import './DivisasManagement.css';
import '../movimiento/MovimientoModals.css';

export const DivisasManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [editingDivisa, setEditingDivisa] = useState(null);
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        tasaEnQuetzales: ''
    });
    const {
        divisas,
        cargarDivisas,
        loading,
        error,
        setError,
        success,
        agregarOActualizarDivisa,
        restaurarTasas
    } = useDivisasManagement();

    useEffect(() => {
        const userDetails = localStorage.getItem('user');
        if (userDetails) {
            try {
                const parsedUser = JSON.parse(userDetails);
                setUser(parsedUser);
                if (parsedUser.rol === 'ADMIN') {
                    cargarDivisas();
                }
            } catch (err) {
                console.error('Error parsing user:', err);
            }
        }
    }, []);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.codigo || !formData.nombre || !formData.tasaEnQuetzales) {
            setError('Todos los campos son obligatorios');
            return;
        }
        if (parseFloat(formData.tasaEnQuetzales) <= 0) {
            setError('La tasa debe ser mayor a 0');
            return;
        }
        await agregarOActualizarDivisa(formData, editingDivisa);
        if (!error) {
            setShowModal(false);
            resetForm();
        }
    };

    const handleEdit = (divisa) => {
        setEditingDivisa(divisa);
        setFormData({
            codigo: divisa.codigo,
            nombre: divisa.nombre,
            tasaEnQuetzales: divisa.tasaEnQuetzales.toString()
        });
        setShowModal(true);
    };

    const handleRestaurarTasas = async () => {
        await restaurarTasas();
    };

    const resetForm = () => {
        setFormData({
            codigo: '',
            nombre: '',
            tasaEnQuetzales: ''
        });
        setEditingDivisa(null);
        setError('');
    };

    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };

    if (!user || user.rol !== 'ADMIN') {
        return (
            <Card>
                <div className="access-denied">
                    <h3>Acceso Denegado</h3>
                    <p>Solo los administradores pueden gestionar las divisas.</p>
                </div>
            </Card>
        );
    }

    return (
        <div className="divisas-management">
            <Card>
                <div className="management-header">
                    <div>
                        <h2>Gestión de Divisas</h2>
                        <p className="text-muted">Administra las divisas y sus tasas de cambio</p>
                    </div>
                    <div className="header-actions">
                        <Button
                            onClick={handleRestaurarTasas}
                            disabled={loading}
                            variant="outline"
                            className="btn-restaurar"
                        >
                            {loading ? 'Restaurando...' : 'Restaurar Tasas Oficiales'}
                        </Button>
                        <Button 
                            onClick={() => setShowModal(true)}
                            disabled={loading}
                        >
                            Agregar Divisa
                        </Button>
                    </div>
                </div>
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}
                {loading && !showModal ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Cargando divisas...</p>
                    </div>
                ) : (
                    <div className="divisas-table">
                        <div className="table-header">
                            <div className="header-cell">Código</div>
                            <div className="header-cell">Nombre</div>
                            <div className="header-cell">Tasa en GTQ</div>
                            <div className="header-cell">Última Actualización</div>
                            <div className="header-cell">Acciones</div>
                        </div>
                        {divisas.length > 0 ? (
                            divisas.map((divisa) => (
                                <div key={divisa.did || divisa._id || divisa.codigo} className="table-row">
                                    <div className="table-cell">
                                        <span className="currency-code">{divisa.codigo}</span>
                                    </div>
                                    <div className="table-cell">
                                        <span className="currency-name">{divisa.nombre}</span>
                                    </div>
                                    <div className="table-cell">
                                        <span className="currency-rate">
                                            {divisa.tasaEnQuetzales.toFixed(6)}
                                        </span>
                                    </div>
                                    <div className="table-cell">
                                        <span className="update-date">
                                            {divisa.fechaActualizacion 
                                                ? new Date(divisa.fechaActualizacion).toLocaleString('es-GT')
                                                : 'N/A'
                                            }
                                        </span>
                                    </div>
                                    <div className="table-cell">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(divisa)}
                                        >
                                            Editar
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-data">
                                <p>No hay divisas registradas</p>
                            </div>
                        )}
                    </div>
                )}
            </Card>
            <Modal isOpen={showModal} onClose={closeModal} title={editingDivisa ? 'Editar Divisa' : 'Agregar Nueva Divisa'}>
                <form onSubmit={handleSubmit} className="divisa-form">
                    <div className="form-group">
                        <label htmlFor="codigo">Código de Divisa</label>
                        <Input
                            id="codigo"
                            type="text"
                            value={formData.codigo}
                            onChange={(e) => handleInputChange('codigo', e.target.value.toUpperCase())}
                            placeholder="USD, EUR, etc."
                            maxLength={3}
                            disabled={editingDivisa !== null}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre de la Divisa</label>
                        <Input
                            id="nombre"
                            type="text"
                            value={formData.nombre}
                            onChange={(e) => handleInputChange('nombre', e.target.value)}
                            placeholder="Dólar Estadounidense"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="tasa">Tasa en Quetzales</label>
                        <Input
                            id="tasa"
                            type="number"
                            step="0.000001"
                            min="0"
                            value={formData.tasaEnQuetzales}
                            onChange={(e) => handleInputChange('tasaEnQuetzales', e.target.value)}
                            placeholder="7.750000"
                            required
                        />
                        <small className="helper-text">
                            Ejemplo: Si 1 USD = 7.75 GTQ, ingrese 7.750000
                        </small>
                    </div>
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                    <div className="form-actions">
                        <Button type="button" variant="outline" onClick={closeModal}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Guardando...' : editingDivisa ? 'Actualizar' : 'Agregar'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};