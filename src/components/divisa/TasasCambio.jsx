import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { getDivisas, restaurarTasasOficiales } from '../../services/api';
import './TasasCambio.css';

export const TasasCambio = () => {
    const [divisas, setDivisas] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [user, setUser] = useState(null);

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
    }, []);

    const cargarDivisas = async () => {
        try {
            setLoading(true);
            const response = await getDivisas(filtro);
            
            if (response.error) {
                setError('Error al cargar las tasas de cambio');
                return;
            }
            
            setDivisas(response.data.divisas || []);
        } catch (err) {
            setError('Error al cargar las tasas de cambio');
        } finally {
            setLoading(false);
        }
    };

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };

    const buscarDivisas = () => {
        cargarDivisas();
    };

    const handleRestaurarTasas = async () => {
        if (!user || user.rol !== 'ADMIN') {
            setError('Solo los administradores pueden restaurar las tasas');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            const response = await restaurarTasasOficiales();
            
            if (response.error) {
                setError(response.err?.response?.data?.msg || 'Error al restaurar las tasas');
            } else {
                setSuccess('Tasas de cambio restauradas correctamente');
                cargarDivisas(); 
            }
        } catch (err) {
            setError('Error al restaurar las tasas oficiales');
        } finally {
            setLoading(false);
        }
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
                                <div key={divisa._id} className="tasa-card">
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