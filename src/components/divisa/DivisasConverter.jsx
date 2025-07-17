import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { useDivisas } from '../../shared/hooks/useDivisas';
import { useConversion } from '../../shared/hooks/useConversion';
import './DivisasConverter.css';

export const DivisasConverter = () => {
    const [monto, setMonto] = useState('');
    const [divisaOrigen, setDivisaOrigen] = useState('GTQ');
    const [divisaDestino, setDivisaDestino] = useState('USD');
    
    const { getDivisasOptions } = useDivisas();
    const { loading, error, resultado, convertir, limpiarError } = useConversion();

    const handleConvertir = async (e) => {
        e.preventDefault();
        await convertir(monto, divisaOrigen, divisaDestino);
    };

    const intercambiarDivisas = () => {
        setDivisaOrigen(divisaDestino);
        setDivisaDestino(divisaOrigen);
    };

    const handleMontoChange = (e) => {
        setMonto(e.target.value);
        limpiarError();
    };

    const divisasOptions = getDivisasOptions();

    return (
        <div className="divisas-converter">
            <Card>
                <div className="card-header">
                    <h2>Conversor de Divisas</h2>
                    <p className="text-muted">Convierte entre diferentes monedas</p>
                </div>

                <form onSubmit={handleConvertir} className="converter-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Monto</label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={monto}
                                onChange={handleMontoChange}
                                placeholder="Ingrese el monto"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>De</label>
                            <Select
                                value={divisaOrigen}
                                onChange={(e) => setDivisaOrigen(e.target.value)}
                                options={divisasOptions}
                            />
                        </div>

                        <div className="exchange-button">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={intercambiarDivisas}
                                className="btn-exchange"
                            >
                                ⇄
                            </Button>
                        </div>

                        <div className="form-group">
                            <label>A</label>
                            <Select
                                value={divisaDestino}
                                onChange={(e) => setDivisaDestino(e.target.value)}
                                options={divisasOptions}
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
                        disabled={loading || !monto}
                        className="btn-convert"
                    >
                        {loading ? 'Convirtiendo...' : 'Convertir'}
                    </Button>
                </form>

                {resultado && (
                    <div className="conversion-result">
                        <div className="result-card">
                            <div className="result-header">
                                <h3>Resultado de la Conversión</h3>
                            </div>
                            <div className="result-content">
                                <div className="amount-display">
                                    <span className="original-amount">
                                        {resultado.monto.toLocaleString()} {resultado.divisaOrigen}
                                    </span>
                                    <span className="equals">=</span>
                                    <span className="converted-amount">
                                        {resultado.montoConvertido.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 4
                                        })} {resultado.divisaDestino}
                                    </span>
                                </div>
                                <div className="exchange-rate">
                                    <small className="text-muted">
                                        Tasa de cambio: 1 {resultado.divisaOrigen} = {resultado.tasa.toLocaleString(undefined, {
                                            minimumFractionDigits: 4,
                                            maximumFractionDigits: 6
                                        })} {resultado.divisaDestino}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};