import React from 'react';
import MovimientoItem from './MovimientoItem';
import { Loader, Pagination } from '../ui';

const MovimientosList = ({ 
    movimientos, 
    loading, 
    error, 
    pagination, 
    onPageChange,
    onMovimientoClick 
}) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-red-600 mb-2">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-red-800 mb-2">Error al cargar movimientos</h3>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!movimientos || movimientos.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No hay movimientos</h3>
                <p className="text-gray-500">No se encontraron movimientos con los filtros aplicados.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="grid gap-4 mb-6">
                {movimientos.map((movimiento) => (
                    <MovimientoItem
                        key={movimiento._id || movimiento.mid}
                        movimiento={movimiento}
                        onClick={onMovimientoClick}
                    />
                ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center">
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default MovimientosList;