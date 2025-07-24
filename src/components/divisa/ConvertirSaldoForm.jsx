
import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { CurrencySelector } from './CurrencySelector';
import { useConvertirSaldoCuenta } from '../../shared/hooks/useConvertirSaldoCuenta';
import './ConvertirSaldoForm.css';


export const ConvertirSaldoForm = () => {
    const [selectedCuenta, setSelectedCuenta] = useState('');
    const [divisaDestino, setDivisaDestino] = useState('');
    const {
        cuentas,
        cargarCuentas,
        loading,
        error,
        setError,
        resultado,
        convertirSaldo
    } = useConvertirSaldoCuenta();

    useEffect(() => {
        cargarCuentas();
    }, []);

    const handleConvertir = async (e) => {
        e.preventDefault();
        if (!selectedCuenta) {
            setError('Seleccione una cuenta');
            return;
        }
        if (!divisaDestino) {
            setError('Seleccione la divisa de destino');
            return;
        }
        if (divisaDestino === 'GTQ') {
            setError('El saldo ya está en Quetzales');
            return;
        }
        
        await convertirSaldo(selectedCuenta, divisaDestino);
    };

    const cuentasOptions = cuentas.map(cuenta => {
        return {
            value: cuenta.cid || cuenta._id,
            label: `${cuenta.numeroCuenta} - ${cuenta.tipo} (Q${cuenta.saldo.toLocaleString()})`
        };
    });

    const selectedCuentaData = cuentas.find(c => (c.cid || c._id) === selectedCuenta);

    return (
        <div className="convertir-saldo-form">
            <Card>
                <div className="card-header">
                    <h2>Convertir Saldo de Cuenta</h2>
                    <p className="text-muted">Consulta el equivalente del saldo de tu cuenta en otra divisa</p>
                </div>

                {loading && cuentas.length === 0 ? (
                    <div className="loading-message">
                        Cargando cuentas...
                    </div>
                ) : cuentas.length === 0 && !loading ? (
                    <div className="no-accounts-message">
                        <p>No tienes cuentas disponibles para convertir saldo.</p>
                        <p>Debes tener al menos una cuenta activa para usar esta función.</p>
                    </div>
                ) : (
                    <form onSubmit={handleConvertir} className="form">
                        <div className="form-group">
                            <label htmlFor="cuenta">Seleccionar Cuenta</label>
                            <Select
                                id="cuenta"
                                value={selectedCuenta}
                                onChange={(e) => setSelectedCuenta(e.target.value)}
                                options={[
                                    { value: '', label: 'Selecciona una cuenta' },
                                    ...cuentasOptions
                                ]}
                            />
                            {selectedCuentaData && (
                                <div className="cuenta-info">
                                    <small>
                                        Saldo actual: Q{selectedCuentaData.saldo.toLocaleString()} GTQ
                                    </small>
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="divisaDestino">Convertir a</label>
                            <CurrencySelector
                                value={divisaDestino}
                                onChange={(e) => setDivisaDestino(e.target.value)}
                                includeGTQ={false}
                                placeholder="Selecciona la divisa de destino"
                            />
                        </div>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <Button 
                            type="submit" 
                            disabled={loading || !selectedCuenta || !divisaDestino}
                            className="submit-btn"
                        >
                            {loading ? 'Convirtiendo...' : 'Convertir Saldo'}
                        </Button>
                    </form>
                )}

                {resultado && (
                    <div className="conversion-result">
                        <div className="result-card">
                            <div className="result-header">
                                <h3>Equivalencia del Saldo</h3>
                            </div>
                            <div className="result-content">
                                <div className="account-info">
                                    <div className="account-detail">
                                        <span className="label">Cuenta:</span>
                                        <span className="value">
                                            {selectedCuentaData?.numeroCuenta} - {selectedCuentaData?.tipo}
                                        </span>
                                    </div>
                                </div>
                                <div className="amount-display">
                                    <div className="original-amount">
                                        <span className="amount">
                                            Q{resultado.saldoOriginal.toLocaleString()}
                                        </span>
                                        <span className="currency">{resultado.divisaOrigen}</span>
                                    </div>
                                    <div className="equals">≈</div>
                                    <div className="converted-amount">
                                        <span className="amount">
                                            {resultado.saldoConvertido.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 4
                                            })}
                                        </span>
                                        <span className="currency">{resultado.divisaDestino}</span>
                                    </div>
                                </div>
                                <div className="exchange-rate">
                                    <small>
                                        Tasa de cambio: 1 {resultado.divisaOrigen} = {resultado.tasa.toLocaleString(undefined, {
                                            minimumFractionDigits: 4,
                                            maximumFractionDigits: 6
                                        })} {resultado.divisaDestino}
                                    </small>
                                </div>
                                <div className="disclaimer">
                                    <small>
                                        * Esta es una conversión informativa. El saldo real de su cuenta permanece en {resultado.divisaOrigen}.
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