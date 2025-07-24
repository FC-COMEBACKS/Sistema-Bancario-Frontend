import React, { useState } from 'react';

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
        { value: 'TRANSFERENCIA', label: '🔄 Transferencia' },
        { value: 'DEPOSITO', label: '💰 Depósito' },
        { value: 'COMPRA', label: '🛒 Compra' },
        { value: 'CREDITO', label: '💳 Crédito' },
        { value: 'CANCELACION', label: '❌ Cancelación' }
    ];

    return (
        <div className="filters-grid">
            <div className="filter-group">
                <label className="filter-label">
                    🏷️ Tipo de movimiento
                </label>
                <select
                    className="filter-input"
                    value={filters.tipo}
                    onChange={handleTipoChange}
                    disabled={loading}
                >
                    <option value="">Todos los tipos</option>
                    {tiposMovimiento.map(tipo => (
                        <option key={tipo.value} value={tipo.value}>
                            {tipo.label}
                        </option>
                    ))}
                </select>
            </div>
            
            <div className="filter-group">
                <label className="filter-label">
                    📅 Fecha desde
                </label>
                <input
                    type="date"
                    className="filter-input"
                    value={filters.fechaDesde}
                    onChange={e => handleInputChange('fechaDesde', e.target.value)}
                    onBlur={handleInputBlurOrEnter}
                    onKeyDown={e => { if (e.key === 'Enter') handleInputBlurOrEnter(); }}
                    disabled={loading}
                />
            </div>
            
            <div className="filter-group">
                <label className="filter-label">
                    📅 Fecha hasta
                </label>
                <input
                    type="date"
                    className="filter-input"
                    value={filters.fechaHasta}
                    onChange={e => handleInputChange('fechaHasta', e.target.value)}
                    onBlur={handleInputBlurOrEnter}
                    onKeyDown={e => { if (e.key === 'Enter') handleInputBlurOrEnter(); }}
                    disabled={loading}
                />
            </div>
            
            <div className="filter-group">
                <label className="filter-label">
                    💰 Monto mínimo
                </label>
                <input
                    type="text"
                    className="filter-input"
                    inputMode="decimal"
                    pattern="^\\d*\\.?\\d*$"
                    value={filters.montoMinimo}
                    onChange={e => handleInputChange('montoMinimo', e.target.value)}
                    onBlur={handleInputBlurOrEnter}
                    onKeyDown={e => { if (e.key === 'Enter') handleInputBlurOrEnter(); }}
                    placeholder="Q 0.00"
                    disabled={loading}
                />
            </div>
            
            <div className="filter-group">
                <label className="filter-label">
                    💰 Monto máximo
                </label>
                <input
                    type="text"
                    className="filter-input"
                    inputMode="decimal"
                    pattern="^\\d*\\.?\\d*$"
                    value={filters.montoMaximo}
                    onChange={e => handleInputChange('montoMaximo', e.target.value)}
                    onBlur={handleInputBlurOrEnter}
                    onKeyDown={e => { if (e.key === 'Enter') handleInputBlurOrEnter(); }}
                    placeholder="Q 0.00"
                    disabled={loading}
                />
            </div>
            
            <div className="filter-group">
                <label className="filter-label" style={{ opacity: 0 }}>
                    Acciones
                </label>
                <button 
                    className="action-button secondary"
                    onClick={clearFilters}
                    disabled={loading}
                    style={{ width: '100%' }}
                >
                    🧹 Limpiar
                </button>
            </div>
        </div>
    );
};

export default MovimientoFilter;