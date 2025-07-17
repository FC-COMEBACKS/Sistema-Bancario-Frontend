
import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useTasasCambio } from '../../shared/hooks/useTasasCambio';
import './TasasCambio.css';


export const TasasCambio = () => {
    const [filtro, setFiltro] = useState('');
    const [user, setUser] = useState(null);
    const {
        divisas,
        cargarDivisas,
        loading,
        error,
        success,
        restaurarTasas
    } = useTasasCambio();

    useEffect(() => {
        const userDetails = localStorage.getItem('user');
        if (userDetails) {
            try {
                const parsedUser = JSON.parse(userDetails);
                setUser(parsedUser);
            } catch (err) {
                console.error('Error parsing user:', err);
            }
        }
        cargarDivisas();
        // eslint-disable-next-line
    }, []);

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };

    const buscarDivisas = () => {
        cargarDivisas(filtro);
    };

    const handleRestaurarTasas = async () => {
        await restaurarTasas(user);
    };

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleString('es-GT', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calcularTasaInversa = (tasaEnQuetzales) => {
        return (1 / tasaEnQuetzales).toFixed(6);
    };

    return (
        <div className="tasas-cambio">
            <Card>
                <div className="tasas-header">
                    <div className="header-content">
                        <h2>Tasas de Cambio</h2>
                        <p className="text-muted">Consulta las tasas de cambio actuales</p>
                    </div>
                    {user && user.rol === 'ADMIN' && (
                        <Button
                            onClick={handleRestaurarTasas}
                            disabled={loading}
                            variant="outline"
                            className="btn-restaurar"
                        >
                            {loading ? 'Restaurando...' : 'Restaurar Tasas Oficiales'}
                        </Button>
                    )}
                </div>
                <div className="search-section">
                    <div className="search-bar">
                        <Input
                            type="text"
                            placeholder="Buscar por código o nombre de divisa..."
                            value={filtro}
                            onChange={handleFiltroChange}
                            onKeyPress={(e) => e.key === 'Enter' && buscarDivisas()}
                        />
                        <Button onClick={buscarDivisas} disabled={loading}>
                            Buscar
                        </Button>
                    </div>
                </div>
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Cargando tasas de cambio...</p>
                    </div>
                ) : (
                    <div className="tasas-grid">
                        {/* Mostrar Q de referencia*/}
                        <div className="tasa-card base-currency">
                            <div className="currency-header">
                                <h3>GTQ</h3>
                                <span className="currency-name">Quetzal Guatemalteco</span>
                            </div>
                            <div className="tasa-info">
                                <div className="tasa-principal">
                                    <span className="tasa-valor">1.000000</span>
                                    <span className="tasa-label">Moneda Base</span>
                                </div>
                            </div>
                        </div>
                        {divisas.length > 0 ? (
                            divisas.map((divisa) => (
                                <div key={divisa.did || divisa._id || divisa.codigo} className="tasa-card">
                                    <div className="currency-header">
                                        <h3>{divisa.codigo}</h3>
                                        <span className="currency-name">{divisa.nombre}</span>
                                    </div>
                                    <div className="tasa-info">
                                        <div className="tasa-principal">
                                            <span className="tasa-valor">
                                                {divisa.tasaEnQuetzales.toFixed(6)}
                                            </span>
                                            <span className="tasa-label">GTQ por {divisa.codigo}</span>
                                        </div>
                                        <div className="tasa-secundaria">
                                            <span className="tasa-valor-small">
                                                {calcularTasaInversa(divisa.tasaEnQuetzales)}
                                            </span>
                                            <span className="tasa-label-small">{divisa.codigo} por GTQ</span>
                                        </div>
                                    </div>
                                    {divisa.fechaActualizacion && (
                                        <div className="fecha-actualizacion">
                                            <small>
                                                Actualizado: {formatearFecha(divisa.fechaActualizacion)}
                                            </small>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            !loading && (
                                <div className="no-results">
                                    <p>No se encontraron divisas</p>
                                    {filtro && (
                                        <Button onClick={() => {
                                            setFiltro('');
                                            cargarDivisas();
                                        }}>
                                            Limpiar filtro
                                        </Button>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};