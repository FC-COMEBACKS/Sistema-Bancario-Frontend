import React, { useState } from 'react';
import { Input, Select, Button } from '../ui';
import './ProductoFilters.css';

const ProductoFilters = ({ onFilterChange, loading = false }) => {
    const [filters, setFilters] = useState({
        nombre: '',
        disponible: '',
        precioMin: '',
        precioMax: ''
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
            precioMax: ''
        };
        setFilters(clearedFilters);
        onFilterChange(clearedFilters);
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="producto-filters">
            <h4>Filtros</h4>
            
            <div className="filters-grid">
                <Input
                    label="Buscar por nombre"
                    placeholder="Nombre del producto..."
                    value={filters.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    onBlur={handleInputBlurOrEnter}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleInputBlurOrEnter(); }}
                    disabled={loading}
                />
                
                <Select
                    label="Estado"
                    name="disponible"
                    value={filters.disponible}
                    onChange={(e) => handleSelectChange('disponible', e.target.value)}
                    disabled={loading}
                    placeholder="Seleccione un estado"
                    options={[
                        { value: '', label: 'Todos los estados' },
                        { value: 'true', label: 'Disponibles' },
                        { value: 'false', label: 'No disponibles' }
                    ]}
                />

                <Input
                    label="Precio mínimo"
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

                <Input
                    label="Precio máximo"
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
                
                {!isPriceRangeValid() && (
                    <div style={{ 
                        color: '#dc3545', 
                        fontSize: '12px', 
                        marginTop: '5px',
                        gridColumn: 'span 2'
                    }}>
                        El precio mínimo no puede ser mayor que el precio máximo
                    </div>
                )}
            </div>
            
            {hasActiveFilters && (
                <div className="filter-actions">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                        disabled={loading}
                    >
                        Limpiar filtros
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ProductoFilters;
