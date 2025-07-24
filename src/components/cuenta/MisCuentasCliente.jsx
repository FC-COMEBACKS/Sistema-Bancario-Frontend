import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Modal, Input } from '../ui';
import { useCuenta } from '../../shared/hooks';
import { useFavorito } from '../../shared/hooks/useFavorito';
import CuentaDetails from './CuentaDetails';
import CuentaForm from './CuentaForm';
import './MisCuentas.css';

const MisCuentasCliente = () => {
    const userData = useMemo(() => {
        const userDataString = localStorage.getItem('user');
        const parsedData = userDataString ? JSON.parse(userDataString) : {};
        return parsedData;
    }, []);
    
    const { 
        cuentas, 
        loading, 
        error, 
        selectedCuenta,
        cuentasAgregadas,
        fetchCuentaByUsuario,
        fetchCuentaDetails,
        fetchCuentasAgregadas,
        agregarCuentaDeUsuario,
        updateCuenta,
        clearError
    } = useCuenta();

    const {
        agregarAFavoritos,
        loading: favoritosLoading,
        error: favoritosError
    } = useFavorito();
    
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCuentaId, setSelectedCuentaId] = useState(null);
    const [actionMessage, setActionMessage] = useState({ text: '', type: '' });
    const [showAddCuentaModal, setShowAddCuentaModal] = useState(false);
    const [numeroCuentaAgregar, setNumeroCuentaAgregar] = useState('');

    useEffect(() => {
        const userId = userData.uid || userData._id;
        
        if (userId) {
                   fetchCuentaByUsuario(userId);
                   fetchCuentasAgregadas();
               } else {
                   console.error('No se encontró ID de usuario en localStorage');
                   setActionMessage({
                       text: 'Error: No se pudo identificar el usuario',
                       type: 'error'
                   });
               }
           }, [userData, fetchCuentaByUsuario, fetchCuentasAgregadas]);
       
           useEffect(() => {
           }, [cuentas, loading, error]);

    const handleViewDetails = async (cuenta) => {
        setSelectedCuentaId(cuenta.cid);
        const success = await fetchCuentaDetails(cuenta.cid);
        if (success) {
            setShowDetailsModal(true);
        }
    };

    const handleEdit = (cuenta) => {
        setSelectedCuentaId(cuenta.cid);
        setShowEditModal(true);
        clearError();
    };

    const handleEditSubmit = async (formData) => {
        if (selectedCuentaId) {
            const success = await updateCuenta(selectedCuentaId, formData);
            if (success) {
                setActionMessage({ 
                    text: 'Cuenta actualizada exitosamente', 
                    type: 'success' 
                });
                setShowEditModal(false);
                setSelectedCuentaId(null);
                const userId = userData.uid || userData._id;
                if (userId) {
                    fetchCuentaByUsuario(userId);
                }
            } else {
                setActionMessage({
                    text: 'Error al actualizar la cuenta',
                    type: 'error'
                });
            }
        }
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedCuentaId(null);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedCuentaId(null);
        clearError();
    };

    const handleAgregarCuenta = async () => {
        if (!numeroCuentaAgregar.trim()) {
            setActionMessage({
                text: 'Por favor ingresa un número de cuenta válido',
                type: 'error'
            });
            return;
        }

        const success = await agregarCuentaDeUsuario(numeroCuentaAgregar);
        if (success) {
            setActionMessage({
                text: 'Cuenta agregada exitosamente',
                type: 'success'
            });
            setShowAddCuentaModal(false);
            setNumeroCuentaAgregar('');
             await fetchCuentasAgregadas();
        } else {
            setActionMessage({
                text: 'Error al agregar la cuenta',
                type: 'error'
            });
        }
    };

    const handleCloseAddCuentaModal = () => {
        setShowAddCuentaModal(false);
        setNumeroCuentaAgregar('');
        clearError();
    };

    const handleAgregarAFavoritos = async (cuenta) => {
        const alias = prompt(`¿Cómo quieres llamar a esta cuenta?\nPropietario: ${cuenta.usuario?.nombre || 'N/A'}\nCuenta: ${cuenta.numeroCuenta}`);
        
        if (alias && alias.trim()) {
            const success = await agregarAFavoritos(cuenta.numeroCuenta, alias.trim());
            if (success) {
                setActionMessage({ 
                    text: 'Cuenta agregada a favoritos exitosamente', 
                    type: 'success' 
                });
            } else {
                setActionMessage({
                    text: favoritosError || 'Error al agregar cuenta a favoritos',
                    type: 'error'
                });
            }
        }
    };

    const formatAccountNumber = (numeroCuenta) => {
        if (!numeroCuenta) return '**** **** **** ****';
        const str = numeroCuenta.toString();
        return `**** **** **** ${str.slice(-4)}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-GT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const renderActionMessage = () => {
        if (!actionMessage.text) return null;

        return (
            <div className={`action-message ${actionMessage.type}`}>
                {actionMessage.text}
            </div>
        );
    };



    return (
        <div className="mis-cuentas-page">
            <div className="mis-cuentas-container">
                <div className="page-header">
                    <h1>Mis Cuentas</h1>
                    <p>Administra todas tus cuentas bancarias desde un solo lugar</p>
                </div>

                {renderActionMessage()}
                {error && (
                    <div className="error-card">
                        <h3 className="error-title">❌ Error al cargar las cuentas</h3>
                        <p className="error-description">{error}</p>
                    </div>
                )}

                {loading && (
                    <div className="loading-card">
                        <div className="loading-spinner"></div>
                        <p className="loading-text">Cargando cuentas...</p>
                    </div>
                )}

                {!loading && !error && (
                <>
                    {cuentas.length > 0 ? (
                        <div className="cuentas-grid fade-in">
                            {cuentas.map(cuenta => (
                                <div key={cuenta.cid} className="cuenta-card mi-cuenta">
                                    <div className="cuenta-header">
                                        <div className="cuenta-tipo">
                                            <h3 className={`cuenta-titulo ${cuenta.tipo?.toLowerCase()}`}>
                                                Cuenta de {cuenta.tipo === 'AHORROS' ? 'Ahorro' : 'Corriente'}
                                            </h3>
                                            <div className={`cuenta-status ${cuenta.activa ? 'activa' : 'inactiva'}`}>
                                                {cuenta.activa ? 'Activa' : 'Inactiva'}
                                            </div>
                                        </div>
                                        <p className="cuenta-numero">
                                            {formatAccountNumber(cuenta.numeroCuenta)}
                                        </p>
                                    </div>
                                    
                                    <div className="cuenta-contenido">
                                        <div className="cuenta-saldo">
                                            <div className="saldo-label">Saldo Disponible</div>
                                            <div className="saldo-valor">
                                                Q {cuenta.saldo?.toLocaleString('es-GT', { minimumFractionDigits: 2 }) || '0.00'}
                                            </div>
                                        </div>
                                        
                                        <div className="cuenta-info">
                                            <div className="info-row">
                                                <span className="info-label">Fecha de creación:</span>
                                                <span className="info-value">{formatDate(cuenta.fechaCreacion)}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="cuenta-acciones">
                                            <button 
                                                className="btn-cuenta secondary" 
                                                onClick={() => handleViewDetails(cuenta)}
                                            >
                                                📋 Ver Detalles
                                            </button>
                                            <button 
                                                className="btn-cuenta primary" 
                                                onClick={() => handleEdit(cuenta)}
                                            >
                                                ✏️ Editar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state fade-in">
                            <div className="empty-icon">🏦</div>
                            <h3 className="empty-title">No tienes cuentas registradas</h3>
                            <p className="empty-description">
                                Contacta con un administrador para crear una cuenta bancaria
                            </p>
                        </div>
                    )}
                </>
            )}

            {!loading && !error && (
                <div className="slide-up">
                    <div className="cuentas-agregadas-header">
                        <div className="section-info">
                            <h2>Cuentas Agregadas</h2>
                            <p>Cuentas de otros usuarios que has agregado</p>
                        </div>
                        <button 
                            className="btn-agregar" 
                            onClick={() => setShowAddCuentaModal(true)}
                        >
                            ➕ Agregar Cuenta
                        </button>
                    </div>

                    {cuentasAgregadas.length > 0 ? (
                        <div className="cuentas-grid fade-in">
                            {cuentasAgregadas.map(cuenta => (
                                <div key={cuenta.cid} className="cuenta-card cuenta-agregada">
                                    <div className="cuenta-header">
                                        <div className="cuenta-tipo">
                                            <h3 className={`cuenta-titulo ${cuenta.tipo?.toLowerCase()}`}>
                                                Cuenta de {cuenta.tipo === 'AHORROS' ? 'Ahorro' : 'Corriente'}
                                            </h3>
                                            <div className="cuenta-status agregada">
                                                Agregada
                                            </div>
                                        </div>
                                        <p className="cuenta-numero">
                                            {formatAccountNumber(cuenta.numeroCuenta)}
                                        </p>
                                    </div>
                                    
                                    <div className="cuenta-contenido">
                                        <div className="propietario-info">
                                            Propietario: {cuenta.usuario?.nombre || 'N/A'}
                                        </div>
                                        
                                        <div className="cuenta-info">
                                            <div className="info-row">
                                                <span className="info-label">Número de cuenta:</span>
                                                <span className="info-value">{cuenta.numeroCuenta}</span>
                                            </div>
                                        </div>

                                        <div className="cuenta-acciones">
                                            <button
                                                className="btn-cuenta outline"
                                                onClick={() => handleAgregarAFavoritos(cuenta)}
                                                disabled={favoritosLoading}
                                            >
                                                ⭐ Agregar a Favoritos
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state fade-in">
                            <div className="empty-icon">🔗</div>
                            <h3 className="empty-title">No tienes cuentas agregadas</h3>
                            <p className="empty-description">
                                Agrega cuentas de otros usuarios para transferir dinero fácilmente
                            </p>
                            <button 
                                className="btn-cuenta primary"
                                onClick={() => setShowAddCuentaModal(true)}
                            >
                                Agregar Primera Cuenta
                            </button>
                        </div>
                    )}
                </div>
            )}

            </div>

            <Modal
                isOpen={showDetailsModal}
                onClose={handleCloseDetailsModal}
                title="Detalles de la Cuenta"
                size="lg"
            >
                <CuentaDetails
                    cuenta={selectedCuenta}
                    onEdit={handleEdit}
                    onClose={handleCloseDetailsModal}
                    loading={loading}
                    showEditButton={true}
                />
            </Modal>

            <Modal
                isOpen={showEditModal}
                onClose={handleCloseEditModal}
                title="Editar Cuenta"
            >
                <CuentaForm
                    cuenta={selectedCuenta}
                    onSubmit={handleEditSubmit}
                    onCancel={handleCloseEditModal}
                    loading={loading}
                    isClientView={true}
                />
                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                        {error}
                    </div>
                )}
            </Modal>

            {/* Modal para agregar cuenta */}
            <Modal
                isOpen={showAddCuentaModal}
                onClose={handleCloseAddCuentaModal}
                title="Agregar Cuenta de Usuario"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número de Cuenta
                        </label>
                        <Input
                            type="text"
                            value={numeroCuentaAgregar}
                            onChange={(e) => setNumeroCuentaAgregar(e.target.value)}
                            placeholder="Ingresa el número de cuenta"
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Ingresa el número de cuenta completo del usuario
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleCloseAddCuentaModal}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleAgregarCuenta}
                            {...(loading ? { loading: true } : {})}
                        >
                            Agregar Cuenta
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MisCuentasCliente;