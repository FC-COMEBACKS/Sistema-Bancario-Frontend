import React, { useState } from 'react';
import { Input, Select, Button } from '../ui';

const MovimientoFilter = ({ onFilterChange, loading }) => {
    const [filters, setFilters] = useState({
        tipo: '',
        fechaDesde: '',
        fechaHasta: '',
        montoMin: '',
        montoMax: ''
    });

    const handleFilterChange = (name, value) => {
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const emptyFilters = {
            tipo: '',
            fechaDesde: '',
            fechaHasta: '',
            montoMin: '',
            montoMax: ''
        };
        setFilters(emptyFilters);
        onFilterChange(emptyFilters);
    };

    const tiposMovimiento = [
        { value: '', label: 'Todos los tipos' },
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
                        onChange={(value) => handleFilterChange('tipo', value)}
                        options={tiposMovimiento}
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
                        onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
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
                        onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monto mínimo
                    </label>
                    <Input
                        type="number"
                        value={filters.montoMin}
                        onChange={(e) => handleFilterChange('montoMin', e.target.value)}
                        placeholder="0.00"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monto máximo
                    </label>
                    <Input
                        type="number"
                        value={filters.montoMax}
                        onChange={(e) => handleFilterChange('montoMax', e.target.value)}
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