import React, { useState, useEffect } from 'react';
import { Button } from '../ui';
import { useMovimiento } from '../../shared/hooks/useMovimiento';
import MovimientoFilter from './MovimientoFilter';
import MovimientosList from './MovimientosList';
import TransferForm from './TransferForm';
import DepositoForm from './DepositoForm';
import RevertirForm from './RevertirForm';

const MovimientosManagement = () => {
    const [filters, setFilters] = useState({});
    const [modals, setModals] = useState({
        transfer: false,
        deposit: false,
        revert: false
    });
    const [selectedMovimiento, setSelectedMovimiento] = useState(null);

    const {
        movimientos,
        loading,
        error,
        pagination,
        fetchMovimientos,
        clearMessages
    } = useMovimiento();

    useEffect(() => {
        const loadMovimientos = () => {
            fetchMovimientos(filters);
        };
        loadMovimientos();
    }, [fetchMovimientos, filters]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        fetchMovimientos(newFilters);
    };

    const handlePageChange = (page) => {
        const newFilters = { ...filters, pagina: page };
        setFilters(newFilters);
        fetchMovimientos(newFilters);
    };

    const handleMovimientoClick = (movimiento) => {
        setSelectedMovimiento(movimiento);
        // Aquí podrías abrir un modal de detalles del movimiento
    };

    const openModal = (modalName) => {
        clearMessages();
        setModals(prev => ({
            ...prev,
            [modalName]: true
        }));
    };

    const closeModal = (modalName) => {
        setModals(prev => ({
            ...prev,
            [modalName]: false
        }));
        setSelectedMovimiento(null);
    };

    const handleSuccess = () => {
        const loadMovimientos = () => {
            fetchMovimientos(filters);
        };
        loadMovimientos();
    };

    // Verificar si el usuario es admin para mostrar ciertas opciones
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.rol === 'ADMIN';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Movimientos</h1>
                    <p className="text-gray-600">Administra las transacciones del sistema</p>
                </div>
                <div className="flex space-x-3">
                    {isAdmin && (
                        <Button
                            variant="secondary"
                            onClick={() => openModal('deposit')}
                        >
                            Nuevo Depósito
                        </Button>
                    )}
                    <Button
                        variant="primary"
                        onClick={() => openModal('transfer')}
                    >
                        Nueva Transferencia
                    </Button>
                </div>
            </div>

            <MovimientoFilter
                onFilterChange={handleFilterChange}
                loading={loading}
            />

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Movimientos
                        </h2>
                        <div className="text-sm text-gray-500">
                            {pagination.total > 0 && (
                                `Mostrando ${pagination.total} movimientos`
                            )}
                        </div>
                    </div>

                    <MovimientosList
                        movimientos={movimientos}
                        loading={loading}
                        error={error}
                        pagination={pagination}
                        onPageChange={handlePageChange}
                        onMovimientoClick={handleMovimientoClick}
                    />
                </div>
            </div>

            {/* Modal de Transferencia */}
            <TransferForm
                isOpen={modals.transfer}
                onClose={() => closeModal('transfer')}
                onSuccess={handleSuccess}
            />

            {/* Modal de Depósito */}
            {isAdmin && (
                <DepositoForm
                    isOpen={modals.deposit}
                    onClose={() => closeModal('deposit')}
                    onSuccess={handleSuccess}
                />
            )}

            {/* Modal de Revertir */}
            {isAdmin && (
                <RevertirForm
                    isOpen={modals.revert}
                    onClose={() => closeModal('revert')}
                    onSuccess={handleSuccess}
                    movimiento={selectedMovimiento}
                />
            )}
        </div>
    );
};

export default MovimientosManagement;