import React, { useState, useEffect } from 'react';
import { Card, Loader } from '../ui';
import { getEstadisticasProductosServicios, getEstadisticasProductos } from '../../services';

const ProductoEstadisticas = () => {
    const [estadisticas, setEstadisticas] = useState(null);
    const [productosMasVendidos, setProductosMasVendidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEstadisticas();
    }, []);

    const fetchEstadisticas = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const responseEstadisticas = await getEstadisticasProductosServicios();
            if (responseEstadisticas.error) {
                throw new Error('Error al obtener estadísticas');
            }
            setEstadisticas(responseEstadisticas.data.estadisticas);

            const responseMasVendidos = await getEstadisticasProductos();
            if (!responseMasVendidos.error) {
                setProductosMasVendidos(responseMasVendidos.data.productosMasVendidos || []);
            }
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
        <div className="producto-estadisticas">
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

                {/* Productos Extremos */}
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

                {/* Productos Más Vendidos */}
                <Card className="estadistica-card productos-vendidos">
                    <h4>Productos Más Vendidos</h4>
                    <div className="productos-vendidos-content">
                        {productosMasVendidos.length > 0 ? (
                            <div className="productos-list">
                                {productosMasVendidos.map((item, index) => (
                                    <div key={item.producto._id} className="producto-vendido-item">
                                        <div className="ranking">#{index + 1}</div>
                                        <div className="producto-info">
                                            <div className="nombre">{item.producto.nombre}</div>
                                            <div className="ventas">{item.totalVendido} vendidos</div>
                                            <div className="ingresos">Q{item.ingresosTotales?.toFixed(2) || '0.00'} en ingresos</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-ventas">
                                <p>No hay datos de ventas disponibles</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            <style jsx>{`
                .producto-estadisticas {
                    margin: 20px 0;
                }

                .estadisticas-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
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

                .productos-vendidos {
                    grid-column: span 2;
                }

                .productos-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .producto-vendido-item {
                    display: flex;
                    align-items: center;
                    padding: 12px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    border-left: 4px solid #007bff;
                }

                .ranking {
                    font-size: 1.5em;
                    font-weight: bold;
                    color: #007bff;
                    margin-right: 15px;
                    min-width: 40px;
                }

                .producto-info {
                    flex: 1;
                }

                .nombre {
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 4px;
                }

                .ventas {
                    color: #666;
                    font-size: 0.9em;
                }

                .ingresos {
                    color: #28a745;
                    font-weight: bold;
                    font-size: 0.9em;
                }

                .no-ventas {
                    text-align: center;
                    color: #666;
                    padding: 40px 20px;
                }

                @media (max-width: 768px) {
                    .productos-vendidos {
                        grid-column: span 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductoEstadisticas;
