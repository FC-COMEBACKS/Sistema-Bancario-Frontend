import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Modal } from '../ui';
import { useCuenta, useUser } from '../../shared/hooks';
import CuentasDashboard from './CuentasDashboard';
import CuentaForm from './CuentaForm';
import CuentaDetails from './CuentaDetails';
import '../movimiento/MovimientoModals.css';
import '../../pages/cuenta/cuentaPage.css';

const CuentaManagement = () => {
    const {
        loading,
        error,
        cuentas,
        pagination,
        selectedCuenta: cuentaFromHook,
        createCuenta,
        updateCuenta,
        fetchCuentaDetails,
        clearError,
        deleteCuenta,
        fetchCuentas
    } = useCuenta();
    const { users, fetchUsers } = useUser();
    
    const [mode, setMode] = useState('list'); 
    const [selectedCuentaId, setSelectedCuentaId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCuenta, setSelectedCuenta] = useState(null);
    const [actionMessage, setActionMessage] = useState({ text: '', type: '' });

    const loadCuentaById = useCallback(async () => {
        if (selectedCuentaId && (mode === 'view' || mode === 'edit')) {
            await fetchCuentaDetails(selectedCuentaId);
        }
    }, [selectedCuentaId, mode, fetchCuentaDetails]);

    useEffect(() => {
        loadCuentaById();
    }, [loadCuentaById]);

    const handleCreate = () => {
        setSelectedCuentaId(null);
        setMode('create');
        clearError();
    };

    const handleEdit = (cuenta) => {
        const cuentaId = cuenta.cid || cuenta._id || cuenta.numeroCuenta;
        setSelectedCuentaId(cuentaId);
        setMode('edit');
        clearError();
    };

    const handleDelete = (cuenta) => {
        setSelectedCuenta(cuenta);
        setShowDeleteModal(true);
    };

    const handleViewDetails = async (cuenta) => {
        const cuentaId = cuenta.cid || cuenta._id || cuenta.numeroCuenta;
        setSelectedCuentaId(cuentaId);
        setMode('view');
    };

    const handleBack = () => {
        setMode('list');
        setSelectedCuentaId(null);
        setSelectedCuenta(null);
        setActionMessage({ text: '', type: '' });
        clearError();
    };

    const handleSubmit = async (formData) => {
        try {
            if (mode === 'edit' && selectedCuentaId) {
                const success = await updateCuenta(selectedCuentaId, formData);
                
                if (success) {
                    setActionMessage({ 
                        text: 'Cuenta actualizada exitosamente', 
                        type: 'success' 
                    });
                    await fetchCuentaDetails(selectedCuentaId);
                    setMode('view');
                    return true;
                } else {
                    setActionMessage({
                        text: 'Error al actualizar la cuenta',
                        type: 'danger'
                    });
                    return false;
                }
            } else if (mode === 'create') {
                const success = await createCuenta(formData);
                
                if (success) {
                    setActionMessage({
                        text: 'Cuenta creada exitosamente',
                        type: 'success'
                    });
                    setMode('list');
                    return true;
                } else {
                    setActionMessage({
                        text: 'Error al crear la cuenta',
                        type: 'danger'
                    });
                    return false;
                }
            }
        } catch {
            setActionMessage({
                text: 'Error inesperado al procesar la solicitud',
                type: 'danger'
            });
            return false;
        }
    };

    const handleDeleteConfirm = async () => {
        if (selectedCuenta) {
            const cuentaId = selectedCuenta.cid || selectedCuenta._id || selectedCuenta.numeroCuenta;
            const success = await deleteCuenta(cuentaId);
            if (success) {
                setActionMessage({ text: 'Cuenta eliminada exitosamente', type: 'success' });
                fetchCuentas();
            } else {
                setActionMessage({ text: 'Error al eliminar la cuenta', type: 'danger' });
            }
            setShowDeleteModal(false);
            setSelectedCuenta(null);
        }
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedCuenta(null);
    };

    const renderHeader = () => {
        const getTitle = () => {
            switch (mode) {
                case 'create':
                    return '➕ Nueva Cuenta Bancaria';
                case 'edit':
                    return '✏️ Editar Cuenta';
                case 'view':
                    return '👁️ Detalles de Cuenta';
                default:
                    return '🏦 Gestión de Cuentas';
            }
        };

        const getDescription = () => {
            switch (mode) {
                case 'create':
                    return 'Crear una nueva cuenta bancaria en el sistema';
                case 'edit':
                    return 'Modificar información y configuración de la cuenta';
                case 'view':
                    return 'Información detallada y historial de la cuenta';
                default:
                    return 'Administra y supervisa todas las cuentas bancarias del sistema';
            }
        };

        return (
            <div className="management-header">
                <div>
                    <h2>{getTitle()}</h2>
                    <p className="management-description">{getDescription()}</p>
                </div>
                <div style={{display: 'flex', gap: '1rem'}}>
                    {mode !== 'list' && (
                        <Button variant="outline" onClick={handleBack}>
                            ⬅️ Volver al Listado
                        </Button>
                    )}
                    {mode === 'list' && (
                        <Button onClick={handleCreate} variant="primary">
                            ➕ Nueva Cuenta
                        </Button>
                    )}
                </div>
            </div>
        );
    };

    const renderActionMessage = () => {
        if (!actionMessage.text) return null;

        const className = actionMessage.type === 'success' ? 'notification success' : 'notification error';

        return (
            <div className={className}>
                <div>
                    <strong>{actionMessage.type === 'success' ? '¡Éxito!' : '¡Error!'}</strong>
                    <p style={{margin: '0.5rem 0 0 0'}}>{actionMessage.text}</p>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (mode === 'list') {
            return (
                <CuentasDashboard
                    cuentas={cuentas}
                    loading={loading}
                    error={error}
                    pagination={pagination}
                    fetchCuentas={fetchCuentas}
                    users={users}
                    fetchUsers={fetchUsers}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onViewDetails={handleViewDetails}
                />
            );
        }

        if (loading) {
            return (
                <div className="loading-state">
                    <div className="loading-spinner">🔄</div>
                    <h3>Cargando información...</h3>
                    <p>Por favor espera mientras procesamos tu solicitud</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="notification error">
                    <div>
                        <strong>Error al cargar la información</strong>
                        <p style={{margin: '0.5rem 0 0 0'}}>{error}</p>
                    </div>
                </div>
            );
        }

        if (mode === 'view' && cuentaFromHook) {
            return (
                <CuentaDetails
                    cuenta={cuentaFromHook}
                    onEdit={() => handleEdit(cuentaFromHook)}
                    onClose={handleBack}
                    loading={loading}
                />
            );
        }

        if (mode === 'edit' || mode === 'create') {
            return (
                <CuentaForm
                    cuenta={mode === 'edit' ? cuentaFromHook : null}
                    onSubmit={handleSubmit}
                    onCancel={mode === 'edit' ? () => setMode('view') : handleBack}
                    loading={loading}
                />
            );
        }

        return (
            <Card className="text-center p-8">
                <div className="text-gray-500">
                    <p>Contenido no disponible</p>
                </div>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            {renderHeader()}
            {renderActionMessage()}
            {renderContent()}

            {}
            <Modal
                isOpen={showDeleteModal}
                onClose={handleCloseDeleteModal}
                title="Confirmar Eliminación"
                className="confirmation-modal"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        ¿Estás seguro de que quieres eliminar la cuenta <strong>{selectedCuenta?.numeroCuenta}</strong>?
                    </p>
                    <p className="text-sm text-red-600">
                        Esta acción no se puede deshacer.
                    </p>
                    <div className="flex space-x-2">
                        <Button
                            variant="danger"
                            onClick={handleDeleteConfirm}
                            disabled={loading}
                        >
                            {loading ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleCloseDeleteModal}
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CuentaManagement;