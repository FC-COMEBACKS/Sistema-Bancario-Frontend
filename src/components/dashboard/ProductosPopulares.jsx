import React, { useEffect } from 'react';
import { useEstadisticas } from '../../shared/hooks';
import Loader from '../ui/Loader';

const ProductosPopulares = () => {
  const { estadisticasProductos, isLoading, hasErrors, fetchEstadisticasProductos } = useEstadisticas();

  useEffect(() => {
    fetchEstadisticasProductos();
  }, []);

  if (isLoading) return <Loader />;
  
  return (
    <div className="dashboard-section">
      <h2>Productos Más Populares</h2>
      
      {hasErrors ? (
        <div className="error-message">
          <p>Error al cargar estadísticas de movimientos</p>
          <small>Verifique la conexión con el servidor</small>
        </div>
      ) : estadisticasProductos && estadisticasProductos.productosPopulares && estadisticasProductos.productosPopulares.length > 0 ? (
        <div className="productos-populares-lista">
          {estadisticasProductos.productosPopulares.map((producto) => (
            <div key={producto.pid} className="producto-popular-item">
              <div className="producto-info">
                <h4>{producto.nombre}</h4>
                <p className="producto-descripcion">{producto.descripcion}</p>
              </div>
              <div className="producto-stats">
                <div className="stat">
                  <span className="stat-label">Compras</span>
                  <span className="stat-value">{producto.totalCompras}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Total</span>
                  <span className="stat-value">Q{producto.montoTotal.toLocaleString()}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Precio</span>
                  <span className="stat-value">Q{producto.precio.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data-message">No hay productos populares disponibles</div>
      )}
      
      <div className="see-more-link">
        <a href="/productos">Ver todos los productos →</a>
      </div>
    </div>
  );
};

export default ProductosPopulares;
