import React, { useState } from 'react';
import { Input, Select, Button } from '../ui';

const ProductoFilters = ({ onFilterChange, loading = false }) => {
    const [filters, setFilters] = useState({
        nombre: '',
        disponible: '',
        precioMin: '',
        precioMax: '',
        categoria: ''
    });

    const handleInputChange = (field, value) => {
        if (field === 'precioMin' || field === 'precioMax') {
            if (!/^\d*\.?\d*$/.test(value) && value !== '') {
                return; 
            }
        }
        
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleSelectChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        
        const validFilters = {};
        if (newFilters.nombre.trim()) validFilters.nombre = newFilters.nombre.trim();
        if (newFilters.disponible) validFilters.disponible = newFilters.disponible;
        if (newFilters.categoria) validFilters.categoria = newFilters.categoria;
        if (newFilters.precioMin !== '' && !isNaN(Number(newFilters.precioMin))) validFilters.precioMin = Number(newFilters.precioMin);
        if (newFilters.precioMax !== '' && !isNaN(Number(newFilters.precioMax))) validFilters.precioMax = Number(newFilters.precioMax);
        
        onFilterChange(validFilters);
    };

    const handleInputBlurOrEnter = () => {
        const min = parseFloat(filters.precioMin);
        const max = parseFloat(filters.precioMax);
        
        if (!isNaN(min) && !isNaN(max) && min > max) {
            return; 
        }
        
        const validFilters = {};
        if (filters.nombre.trim()) validFilters.nombre = filters.nombre.trim();
        if (filters.disponible) validFilters.disponible = filters.disponible;
        if (filters.categoria) validFilters.categoria = filters.categoria;
        if (filters.precioMin !== '' && !isNaN(Number(filters.precioMin))) validFilters.precioMin = Number(filters.precioMin);
        if (filters.precioMax !== '' && !isNaN(Number(filters.precioMax))) validFilters.precioMax = Number(filters.precioMax);
        
        onFilterChange(validFilters);
    };

    const isPriceRangeValid = () => {
        const min = parseFloat(filters.precioMin);
        const max = parseFloat(filters.precioMax);
        
        if (isNaN(min) || isNaN(max)) return true;
        return min <= max;
    };

    const handleClearFilters = () => {
        const clearedFilters = {
            nombre: '',
            disponible: '',
            precioMin: '',
            precioMax: '',
            categoria: ''
        };
        setFilters(clearedFilters);
        onFilterChange({});
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="producto-filters">
            <h4>🔍 Filtros de Búsqueda</h4>
            
            <div className="filters-grid">
                <div className="filter-field">
                    <label>🔍 Buscar producto</label>
                    <Input
                        placeholder="Escribe el nombre del producto..."
                        value={filters.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        onBlur={handleInputBlurOrEnter}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleInputBlurOrEnter(); }}
                        disabled={loading}
                    />
                </div>
                
                <div className="filter-field">
                    <label>📊 Estado de disponibilidad</label>
                    <Select
                        value={filters.disponible}
                        onChange={(e) => handleSelectChange('disponible', e.target.value)}
                        disabled={loading}
                        options={[
                            { value: '', label: '🔄 Todos los estados' },
                            { value: 'true', label: '✅ Disponibles' },
                            { value: 'false', label: '❌ No disponibles' }
                        ]}
                    />
                </div>

                <div className="filter-field">
                    <label>🏷️ Categoría</label>
                    <Select
                        value={filters.categoria}
                        onChange={(e) => handleSelectChange('categoria', e.target.value)}
                        disabled={loading}
                        options={[
                            { value: '', label: '📂 Todas las categorías' },
                            { value: 'Servicios Bancarios', label: '🏦 Servicios Bancarios' },
                            { value: 'Inversiones', label: '📈 Inversiones' },
                            { value: 'Seguros', label: '🛡️ Seguros' },
                            { value: 'Productos Digitales', label: '💻 Productos Digitales' },
                            { value: 'Otros', label: '📦 Otros' }
                        ]}
                    />
                </div>

                <div className="filter-field">
                    <label>💰 Precio mínimo (GTQ)</label>
                    <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={filters.precioMin}
                        onChange={(e) => handleInputChange('precioMin', e.target.value)}
                        onBlur={handleInputBlurOrEnter}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleInputBlurOrEnter(); }}
                        disabled={loading}
                    />
                </div>

                <div className="filter-field">
                    <label>💰 Precio máximo (GTQ)</label>
                    <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={filters.precioMax}
                        onChange={(e) => handleInputChange('precioMax', e.target.value)}
                        onBlur={handleInputBlurOrEnter}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleInputBlurOrEnter(); }}
                        disabled={loading}
                    />
                </div>
            </div>
            
            {!isPriceRangeValid() && (
                <div className="price-error">
                    ⚠️ El precio mínimo no puede ser mayor que el precio máximo
                </div>
            )}
            
            <div className="filter-actions">
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        onClick={handleClearFilters}
                        disabled={loading}
                    >
                        🗑️ Limpiar Filtros
                    </Button>
                )}
                <Button
                    variant="primary"
                    onClick={handleInputBlurOrEnter}
                    disabled={loading || !isPriceRangeValid()}
                >
                    🔍 Aplicar Filtros
                </Button>
            </div>
        </div>
    );
};

export default ProductoFilters;
