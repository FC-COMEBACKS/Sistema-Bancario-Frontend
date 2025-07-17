import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { CurrencySelector } from './CurrencySelector';
import { convertirMonto } from '../../services/api';
import './ConversorForm.css';

export const ConversorForm = ({ onConversionResult, className = "" }) => {
    const [formData, setFormData] = useState({
        monto: '',
        divisaOrigen: 'GTQ',
        divisaDestino: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.monto || formData.monto <= 0) {
            setError('Ingrese un monto válido');
            return;
        }
        if (!formData.divisaDestino) {
            setError('Seleccione la divisa de destino');
            return;
        }
        if (formData.divisaOrigen === formData.divisaDestino) {
            setError('Las divisas de origen y destino deben ser diferentes');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await convertirMonto({
                monto: parseFloat(formData.monto),
                divisaOrigen: formData.divisaOrigen,
                divisaDestino: formData.divisaDestino
            });
            if (response.error) {
                setError(response.err?.response?.data?.msg || 'Error al realizar la conversión');
            } else {
                onConversionResult && onConversionResult(response.data);
            }
        } catch (err) {
            setError('Error al realizar la conversión');
        } finally {
            setLoading(false);
        }
    };

    const intercambiarDivisas = () => {
        if (formData.divisaDestino) {
            setFormData(prev => ({
                ...prev,
                divisaOrigen: prev.divisaDestino,
                divisaDestino: prev.divisaOrigen
            }));
        }
    };
    return (
        <form onSubmit={handleSubmit} className={`conversor-form ${className}`}>
            <div className="form-group">
                <label htmlFor="monto">Monto a convertir</label>
                <Input
                    id="monto"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.monto}
                    onChange={(e) => handleChange('monto', e.target.value)}
                    placeholder="0.00"
                    required
                />
            </div>
            <div className="currency-row">
                <div className="form-group">
                    <label htmlFor="divisaOrigen">Desde</label>
                    <CurrencySelector
                        value={formData.divisaOrigen}
                        onChange={(e) => handleChange('divisaOrigen', e.target.value)}
                        placeholder="Divisa origen"
                    />
                </div>
                <div className="exchange-btn-container">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={intercambiarDivisas}
                        className="exchange-btn"
                        disabled={!formData.divisaDestino}
                    >
                        ⇄
                    </Button>
                </div>
                <div className="form-group">
                    <label htmlFor="divisaDestino">Hacia</label>
                    <CurrencySelector
                        value={formData.divisaDestino}
                        onChange={(e) => handleChange('divisaDestino', e.target.value)}
                        placeholder="Divisa destino"
                    />
                </div>
            </div>
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            <Button 
                type="submit" 
                disabled={loading || !formData.monto || !formData.divisaDestino}
                className="submit-btn"
            >
                {loading ? 'Convirtiendo...' : 'Convertir'}
            </Button>
        </form>
    );
};
