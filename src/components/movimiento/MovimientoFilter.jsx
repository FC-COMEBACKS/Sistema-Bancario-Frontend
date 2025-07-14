import React, { useState } from 'react';
import { Input, Select, Button } from '../ui';

const MovimientoFilter = ({ onFilterChange, loading }) => {
    const [filters, setFilters] = useState({
        tipo: '',
        fechaDesde: '',
        fechaHasta: '',
        montoMinimo: '',
        montoMaximo: ''
    });


    const handleInputChange = (name, value) => {
        let newValue = value;
        if ((name === 'montoMinimo' || name === 'montoMaximo')) {
            if (!/^\d*\.?\d*$/.test(value) && value !== '') {
                return;
            }
        }
        setFilters(prev => ({ ...prev, [name]: newValue }));
    };

    const handleTipoChange = (e) => {
        const value = e.target.value;
        setFilters(prev => ({ ...prev, tipo: value }));

        if (value) {
            const validFilters = {
                ...filters,
                tipo: value
            };
            onFilterChange(validFilters);
        }
    };

    const handleInputBlurOrEnter = () => {
        const validFilters = {};
        if (filters.tipo) validFilters.tipo = filters.tipo;
        if (filters.fechaDesde) validFilters.fechaDesde = filters.fechaDesde;
        if (filters.fechaHasta) validFilters.fechaHasta = filters.fechaHasta;
        if (filters.montoMinimo !== '' && !isNaN(Number(filters.montoMinimo))) validFilters.montoMinimo = Number(filters.montoMinimo);
        if (filters.montoMaximo !== '' && !isNaN(Number(filters.montoMaximo))) validFilters.montoMaximo = Number(filters.montoMaximo);
        onFilterChange(validFilters);
    };

    const clearFilters = () => {
        const emptyFilters = {
            tipo: '',
            fechaDesde: '',
            fechaHasta: '',
            montoMinimo: '',
            montoMaximo: ''
        };
        setFilters(emptyFilters);
        onFilterChange({});
    };

    const tiposMovimiento = [
        { value: 'TRANSFERENCIA', label: 'Transferencia' },
        { value: 'DEPOSITO', label: 'Depósito' },
        { value: 'COMPRA', label: 'Compra' },
        { value: 'CREDITO', label: 'Crédito' },
        { value: 'CANCELACION', label: 'Cancelación' }
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de movimiento
                    </label>
                    <Select
                        value={filters.tipo}
                        onChange={handleTipoChange}
                        options={tiposMovimiento}
                        placeholder="Seleccione un tipo"
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha desde
                    </label>
                    <Input
                        type="date"
                        value={filters.fechaDesde}
                        onChange={e => handleInputChange('fechaDesde', e.target.value)}
                        onBlur={handleInputBlurOrEnter}
                        onKeyDown={e => { if (e.key === 'Enter') handleInputBlurOrEnter(); }}
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha hasta
                    </label>
                    <Input
                        type="date"
                        value={filters.fechaHasta}
                        onChange={e => handleInputChange('fechaHasta', e.target.value)}
                        onBlur={handleInputBlurOrEnter}
                        onKeyDown={e => { if (e.key === 'Enter') handleInputBlurOrEnter(); }}
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monto mínimo
                    </label>
                    <Input
                        type="text"
                        inputMode="decimal"
                        pattern="^\\d*\\.?\\d*$"
                        value={filters.montoMinimo}
                        onChange={e => handleInputChange('montoMinimo', e.target.value)}
                        onBlur={handleInputBlurOrEnter}
                        onKeyDown={e => { if (e.key === 'Enter') handleInputBlurOrEnter(); }}
                        placeholder="0.00"
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monto máximo
                    </label>
                    <Input
                        type="text"
                        inputMode="decimal"
                        pattern="^\\d*\\.?\\d*$"
                        value={filters.montoMaximo}
                        onChange={e => handleInputChange('montoMaximo', e.target.value)}
                        onBlur={handleInputBlurOrEnter}
                        onKeyDown={e => { if (e.key === 'Enter') handleInputBlurOrEnter(); }}
                        placeholder="0.00"
                        disabled={loading}
                    />
                </div>
            </div>
            <div className="flex justify-end mt-4">
                <Button 
                    variant="secondary" 
                    onClick={clearFilters}
                    disabled={loading}
                >
                    Limpiar filtros
                </Button>
            </div>
        </div>
    );
};

export default MovimientoFilter;