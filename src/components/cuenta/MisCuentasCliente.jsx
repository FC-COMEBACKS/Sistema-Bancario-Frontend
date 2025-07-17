import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Modal, Input } from '../ui';
import { useCuenta } from '../../shared/hooks';
import { useFavorito } from '../../shared/hooks/useFavorito';
import CuentaDetails from './CuentaDetails';
import CuentaForm from './CuentaForm';

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
        }
    }, [userData, fetchCuentaByUsuario, fetchCuentasAgregadas]);

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

        const bgColor = actionMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700';

        return (
            <div className={`p-3 border rounded mb-4 ${bgColor}`}>
                {actionMessage.text}
            </div>
        );
    };



    return (
        <div className="space-y-6">
            {}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mis Cuentas</h1>
                    <p className="text-gray-600">Administra tus cuentas bancarias</p>
                </div>
            </div>

            {renderActionMessage()}

            {}
            {error && (
                <Card className="text-center p-8">
                    <div className="text-red-500">
                        <p className="text-lg font-semibold">Error al cargar las cuentas</p>
                        <p className="text-sm text-gray-600 mt-2">{error}</p>
                    </div>
                </Card>
            )}

            {loading && (
                <Card className="text-center p-8">
                    <div className="text-gray-500">
                        <p>Cargando cuentas...</p>
                    </div>
                </Card>
            )}

            {!loading && !error && (
                <>
                    {cuentas.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cuentas.map(cuenta => (
                                <Card key={cuenta.cid} className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Cuenta de {cuenta.tipo === 'AHORROS' ? 'Ahorro' : 'Corriente'}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {formatAccountNumber(cuenta.numeroCuenta)}
                                                </p>
                                            </div>
                                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                                                cuenta.activa 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {cuenta.activa ? 'Activa' : 'Inactiva'}
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Saldo:</span>
                                                <span className="font-semibold text-gray-900">
                                                    Q {cuenta.saldo?.toLocaleString('es-GT', { minimumFractionDigits: 2 }) || '0.00'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Fecha de creación:</span>
                                                <span className="text-sm text-gray-900">
                                                    {formatDate(cuenta.fechaCreacion)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex space-x-2">
                                            <Button 
                                                variant="secondary" 
                                                size="sm" 
                                                onClick={() => handleViewDetails(cuenta)}
                                                className="flex-1"
                                            >
                                                Ver Detalles
                                            </Button>
                                            <Button 
                                                variant="primary" 
                                                size="sm" 
                                                onClick={() => handleEdit(cuenta)}
                                                className="flex-1"
                                            >
                                                Editar
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="text-center p-8">
                            <div className="text-gray-500">
                                <p className="text-lg font-semibold">No tienes cuentas registradas</p>
                                <p className="text-sm text-gray-600 mt-2">
                                    Contacta con un administrador para crear una cuenta bancaria
                                </p>
                            </div>
                        </Card>
                    )}
                </>
            )}

            {}
            {!loading && !error && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Cuentas Agregadas</h2>
                            <p className="text-gray-600">Cuentas de otros usuarios que has agregado</p>
                        </div>
                        <Button 
                            variant="primary" 
                            onClick={() => setShowAddCuentaModal(true)}
                        >
                            Agregar Cuenta
                        </Button>
                    </div>

                    {cuentasAgregadas.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cuentasAgregadas.map(cuenta => (
                                <Card key={cuenta.cid} className="p-6 border-blue-200">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Cuenta de {cuenta.tipo === 'AHORROS' ? 'Ahorro' : 'Corriente'}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {formatAccountNumber(cuenta.numeroCuenta)}
                                                </p>
                                                <p className="text-sm text-blue-600 font-medium">
                                                    Propietario: {cuenta.usuario?.nombre || 'N/A'}
                                                </p>
                                            </div>
                                            <div className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                Agregada
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Número de cuenta:</span>
                                                <span className="text-sm text-gray-900 font-mono">
                                                    {cuenta.numeroCuenta}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-gray-200">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleAgregarAFavoritos(cuenta)}
                                                disabled={favoritosLoading}
                                                className="w-full"
                                            >
                                                ⭐ Agregar a Favoritos
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="text-center p-8 border-dashed border-2 border-gray-300">
                            <div className="text-gray-500">
                                <p className="text-lg font-semibold">No tienes cuentas agregadas</p>
                                <p className="text-sm text-gray-600 mt-2">
                                    Agrega cuentas de otros usuarios para transferir dinero fácilmente
                                </p>
                                <Button 
                                    variant="primary" 
                                    onClick={() => setShowAddCuentaModal(true)}
                                    className="mt-4"
                                >
                                    Agregar Primera Cuenta
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>
            )}

            {}
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

            {}
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

            {}
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