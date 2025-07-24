import React, { useState } from 'react';
import { useAuth } from '../../shared/hooks';
import { ProductosManagement, ProductosCatalog } from '../../components';
import { Button } from '../../components/ui';
import './ProductoServicioPage.css';

const ProductoServicioPage = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('catalog')
  
  const isAdmin = user?.rol === 'ADMIN';

  return (
    <div className="producto-servicio-page">
      {isAdmin && (
        <div className="page-header">
          <div className="view-toggle">
            <Button
              variant={viewMode === 'catalog' ? 'primary' : 'outline'}
              onClick={() => setViewMode('catalog')}
            >
              Vista Catálogo
            </Button>
            <Button
              variant={viewMode === 'management' ? 'primary' : 'outline'}
              onClick={() => setViewMode('management')}
            >
              Gestión de Productos
            </Button>
          </div>
        </div>
      )}

      <div className="page-content">
        {isAdmin && viewMode === 'management' ? (
          <ProductosManagement />
        ) : (
          <ProductosCatalog isAdmin={isAdmin} />
        )}
      </div>
    </div>
  );
};

export default ProductoServicioPage;