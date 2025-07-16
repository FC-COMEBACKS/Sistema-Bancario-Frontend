import React, { useState, useEffect } from 'react';
import { Button } from '../ui';
import { useMovimiento } from '../../shared/hooks/useMovimiento';
import MovimientoFilter from './MovimientoFilter';
import MovimientosTable from './MovimientosTable';
import Pagination from '../ui/Pagination';
import TransferForm from './TransferForm';
import DepositoForm from './DepositoForm';
import RevertirForm from './RevertirForm';
import CreditoForm from './CreditoForm';

const MovimientosManagement = () => {
    const [filters, setFilters] = useState({});
    const [refreshMovimientos, setRefreshMovimientos] = useState(0);
    const [modals, setModals] = useState({
        transfer: false,
        deposit: false,
        revert: false,
        credito: false 
    });
    const [selectedMovimiento, setSelectedMovimiento] = useState(null);

    const {
        movimientos,
        loading,
        error,
        pagination,
        fetchMovimientos,
        clearMessages,
        handleRevertirDeposito
    } = useMovimiento();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.rol === 'ADMIN') {
            fetchMovimientos(filters);
        } else if (user.rol === 'CLIENT') {
            const filtrosCliente = { ...filters, limite: 10, pagina: filters.pagina || 1 };
            fetchMovimientos(filtrosCliente);
        }
    }, [filters, refreshMovimientos, fetchMovimientos]);

    const handleFilterChange = (newFilters) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setFilters({ ...newFilters, pagina: 1 });
        if (user.rol === 'ADMIN') {
            fetchMovimientos({ ...newFilters, pagina: 1 });
        }
    };

    const handlePageChange = (page) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.rol === 'ADMIN') {
            if (page < 1 || page > (pagination.totalPages || 1)) return;
            setFilters(prev => ({ ...prev, pagina: page }));
            fetchMovimientos({ ...filters, pagina: page });
        } else {
            if (page < 1 || page > (pagination.totalPages || 1)) return;
            setFilters(prev => ({ ...prev, pagina: page }));
        }
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
        setRefreshMovimientos(prev => prev + 1);
        
        if (typeof window.refreshClienteHome === 'function') {
            window.refreshClienteHome();
        }
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.rol === 'ADMIN';
    const totalPages = pagination.totalPages || 1;
    const movimientosPaginados = movimientos;

    const handleRevertirClick = (movimiento) => {
        setSelectedMovimiento(movimiento);
        openModal('revert');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Movimientos</h1>
                    <p className="text-gray-600">Administra las transacciones del sistema</p>
                </div>
                <div className="flex space-x-3">
                    {isAdmin && (
                        <>
                            <Button
                                variant="secondary"
                                onClick={() => openModal('deposit')}
                            >
                                Nuevo Depósito
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => openModal('credito')}
                            >
                                Nuevo Crédito
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => openModal('transfer')}
                            >
                                Nueva Transferencia
                            </Button>
                        </>
                    )}
                    {!isAdmin && (
                        <Button
                            variant="primary"
                            onClick={() => openModal('transfer')}
                        >
                            Nueva Transferencia
                        </Button>
                    )}
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
                            {pagination.total > 0 && `Mostrando ${pagination.total} movimientos`}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <span className="text-gray-500">Cargando movimientos...</span>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                            <h3 className="text-lg font-medium text-red-800 mb-2">Error al cargar movimientos</h3>
                            <p className="text-red-600">{error}</p>
                        </div>
                    ) : (
                        <>
                            <MovimientosTable 
                                movimientos={movimientosPaginados} 
                                isAdmin={isAdmin} 
                                onRevertir={handleRevertirClick} 
                            />
                            {(isAdmin
                                ? (pagination && pagination.totalPages > 1)
                                : (totalPages > 1)
                            ) && (
                                <Pagination
                                    currentPage={isAdmin ? pagination.currentPage : (filters.pagina || 1)}
                                    totalPages={isAdmin ? pagination.totalPages : totalPages}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            <TransferForm
                isOpen={modals.transfer}
                onClose={() => closeModal('transfer')}
                onSuccess={handleSuccess}
            />

            {isAdmin && (
                <DepositoForm
                    isOpen={modals.deposit}
                    onClose={() => closeModal('deposit')}
                    onSuccess={handleSuccess}
                />
            )}

            {isAdmin && (
                <RevertirForm
                    isOpen={modals.revert}
                    onClose={() => closeModal('revert')}
                    onSuccess={handleSuccess}
                    movimiento={selectedMovimiento}
                    handleRevertirDeposito={handleRevertirDeposito}
                    loading={loading}
                />
            )}

            {isAdmin && (
                <CreditoForm
                    isOpen={modals.credito}
                    onClose={() => closeModal('credito')}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
};

export default MovimientosManagement;