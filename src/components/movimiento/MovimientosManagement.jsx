import React, { useState, useEffect } from 'react';
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
        <div className="movimientos-management slide-up">
            <div className="management-header">
                <div className="flex justify-between items-center">
                    <div>
                        <h1>🏦 Gestión de Movimientos</h1>
                        <p>Administra las transacciones y operaciones del sistema bancario</p>
                    </div>
                    <div className="actions-container">
                        {isAdmin && (
                            <>
                                <button
                                    className="action-button secondary"
                                    onClick={() => openModal('deposit')}
                                >
                                    💰 Nuevo Depósito
                                </button>
                                <button
                                    className="action-button secondary"
                                    onClick={() => openModal('credito')}
                                >
                                    💳 Nuevo Crédito
                                </button>
                                <button
                                    className="action-button primary"
                                    onClick={() => openModal('transfer')}
                                >
                                    🔄 Nueva Transferencia
                                </button>
                            </>
                        )}
                        {!isAdmin && (
                            <button
                                className="action-button primary"
                                onClick={() => openModal('transfer')}
                            >
                                🔄 Nueva Transferencia
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="filters-container">
                <div className="filters-header">
                    <h4>🔍 Filtros de Búsqueda</h4>
                </div>
                <MovimientoFilter
                    onFilterChange={handleFilterChange}
                    loading={loading}
                />
            </div>

            <div className="movimientos-container">
                <div className="movimientos-header">
                    <div className="flex justify-between items-center">
                        <h2>📊 Historial de Movimientos</h2>
                        <div className="movimientos-stats">
                            {pagination.total > 0 && `📈 ${pagination.total} movimientos registrados`}
                        </div>
                    </div>
                </div>

                <div className="table-container">
                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <span className="loading-text">Cargando movimientos...</span>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <h3>⚠️ Error al cargar movimientos</h3>
                            <p>{error}</p>
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
                                <div className="pagination-container">
                                    <Pagination
                                        currentPage={isAdmin ? pagination.currentPage : (filters.pagina || 1)}
                                        totalPages={isAdmin ? pagination.totalPages : totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
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