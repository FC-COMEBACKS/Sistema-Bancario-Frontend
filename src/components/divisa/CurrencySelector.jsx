import React from 'react';
import Select from '../ui/Select';
import { useDivisas } from '../../shared/hooks/useDivisas';

export const CurrencySelector = ({ 
    value, 
    onChange, 
    includeGTQ = true, 
    placeholder = "Selecciona una divisa",
    className = "",
    disabled = false 
}) => {
    const { divisas, loading, error, getDivisasOptions } = useDivisas();

    if (loading) {
        return (
            <Select
                value=""
                onChange={() => {}}
                options={[{ value: '', label: 'Cargando divisas...' }]}
                disabled={true}
                className={className}
            />
        );
    }

    if (error) {
        return (
            <Select
                value=""
                onChange={() => {}}
                options={[{ value: '', label: 'Error al cargar divisas' }]}
                disabled={true}
                className={className}
            />
        );
    }

    const options = getDivisasOptions(includeGTQ);

    return (
        <Select
            value={value}
            onChange={onChange}
            options={[
                { value: '', label: placeholder },
                ...options
            ]}
            disabled={disabled}
            className={className}
        />
    );
};