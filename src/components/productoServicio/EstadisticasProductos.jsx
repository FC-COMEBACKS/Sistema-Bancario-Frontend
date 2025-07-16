import React, { useState, useEffect } from 'react';
import { Card, Loader } from '../ui';
import { getEstadisticasProductosServicios } from '../../services';

const EstadisticasProductos = () => {
    const [estadisticas, setEstadisticas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEstadisticas();
    }, []);

    const fetchEstadisticas = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await getEstadisticasProductosServicios();
            if (response.error) {
                throw new Error('Error al obtener estadísticas');
            }
            setEstadisticas(response.data.estadisticas);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <Card>
                <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
                    Error: {error}
                </div>
            </Card>
        );
    }

    return (
        <div className="estadisticas-productos">
            <h3>Estadísticas de Productos y Servicios</h3>
            
            <div className="estadisticas-grid">
                {/* Estadísticas Generales */}
                <Card className="estadistica-card">
                    <h4>Resumen General</h4>
                    <div className="stats-content">
                        <div className="stat-item">
                            <span className="stat-label">Total de Productos:</span>
                            <span className="stat-value">{estadisticas?.total || 0}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Disponibles:</span>
                            <span className="stat-value available">{estadisticas?.disponibles || 0}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">No Disponibles:</span>
                            <span className="stat-value unavailable">{estadisticas?.noDisponibles || 0}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Precio Promedio:</span>
                            <span className="stat-value">Q{estadisticas?.precioPromedio?.toFixed(2) || '0.00'}</span>
                        </div>
                    </div>
                </Card>

                {/* Productos Destacados */}
                <Card className="estadistica-card">
                    <h4>Productos Destacados</h4>
                    <div className="stats-content">
                        {estadisticas?.productoMasCaro && (
                            <div className="producto-destacado">
                                <strong>Más Caro:</strong>
                                <div>{estadisticas.productoMasCaro.nombre}</div>
                                <div className="precio">Q{estadisticas.productoMasCaro.precio}</div>
                            </div>
                        )}
                        {estadisticas?.productoMasBarato && (
                            <div className="producto-destacado">
                                <strong>Más Barato:</strong>
                                <div>{estadisticas.productoMasBarato.nombre}</div>
                                <div className="precio">Q{estadisticas.productoMasBarato.precio}</div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            <style jsx>{`
                .estadisticas-productos {
                    background: #ffffff;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    border: 1px solid #e9ecef;
                }

                .estadisticas-productos h3 {
                    margin: 0 0 20px 0;
                    color: #007bff;
                    text-align: center;
                    font-size: 1.5em;
                }

                .estadisticas-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                }

                .estadistica-card {
                    padding: 20px;
                }

                .estadistica-card h4 {
                    margin: 0 0 15px 0;
                    color: #333;
                    border-bottom: 2px solid #f0f0f0;
                    padding-bottom: 10px;
                }

                .stats-content {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .stat-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #f5f5f5;
                }

                .stat-label {
                    font-weight: 500;
                    color: #666;
                }

                .stat-value {
                    font-weight: bold;
                    color: #333;
                }

                .stat-value.available {
                    color: #28a745;
                }

                .stat-value.unavailable {
                    color: #dc3545;
                }

                .producto-destacado {
                    margin-bottom: 15px;
                    padding: 10px;
                    background: #f8f9fa;
                    border-radius: 5px;
                }

                .producto-destacado strong {
                    color: #007bff;
                }

                .precio {
                    font-weight: bold;
                    color: #28a745;
                    font-size: 1.1em;
                }

                @media (max-width: 768px) {
                    .estadisticas-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default EstadisticasProductos;
