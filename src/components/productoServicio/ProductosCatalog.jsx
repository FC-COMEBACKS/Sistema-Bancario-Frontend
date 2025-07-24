import React, { useState, useEffect } from 'react';
import { useProductoServicio } from '../../shared/hooks';
import { useMovimiento } from '../../shared/hooks/useMovimiento';
import ProductoCard from './ProductoCard';
import ProductoFilters from './ProductoFilters';
import CompraForm from './CompraForm';
import ProductoForm from './ProductoForm';
import EstadisticasProductos from './EstadisticasProductos';
import { Button, Pagination, Loader, Modal } from '../ui';
import '../../pages/productoServicio/productoServicioPage.css';

const ProductosCatalog = ({ isAdmin = false }) => {
    const {
        productos,
        loading,
        error,
        pagination,
        fetchProductos,
        updateProducto,
        deleteProducto,
        toggleProductoEstado
    } = useProductoServicio();

    const { 
        handleComprarProducto, 
        loading: compraLoading, 
        error: compraError, 
        clearMessages 
    } = useMovimiento();

    const [filters, setFilters] = useState({});
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [showCompraForm, setShowCompraForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEstadisticas, setShowEstadisticas] = useState(false);
    const [productoToDelete, setProductoToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        const loadData = async () => {
            await fetchProductos({ ...filters, page: currentPage });
        };

        loadData();
    }, [filters, currentPage, fetchProductos]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleComprar = (producto) => {
        setSelectedProducto(producto);
        setShowCompraForm(true);
    };

    const handleToggleEstado = async (productoId) => {
        const result = await toggleProductoEstado(productoId);
        
        if (result.success) {
            await fetchProductos({ ...filters, page: currentPage });
        }
    };

    const handleEdit = (producto) => {
        setSelectedProducto(producto);
        setShowEditForm(true);
    };

    const handleDelete = async (productoId) => {
        setProductoToDelete(productoId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (productoToDelete) {
            const result = await deleteProducto(productoToDelete);
            if (result.success) {
                await fetchProductos({ ...filters, page: currentPage });
            }
        }
        setShowDeleteModal(false);
        setProductoToDelete(null);
    };

    const handleCompraSubmit = async (compraData) => {
        try {
            console.log('Datos recibidos del formulario:', compraData);
            console.log('Producto seleccionado:', selectedProducto);
            
            clearMessages();
            const success = await handleComprarProducto(compraData);
            
            console.log('Resultado de la compra:', success);
            
            if (success) {
                setShowCompraForm(false);
                setSelectedProducto(null);
                
                await fetchProductos({ ...filters, page: currentPage });
                
                if (typeof window.refreshClienteHome === 'function') {
                    window.refreshClienteHome();
                }
                
                alert('Compra realizada exitosamente');
            }
        } catch (error) {
            console.error('Error en la compra:', error);
            alert(`Error: ${error.message || 'No se pudo completar la compra'}`);
        }
    };

    if (loading && productos.length === 0) {
        return (
            <div className="catalog-loading">
                <Loader />
                <h3>🔍 Cargando productos...</h3>
                <p>Estamos buscando los mejores productos para ti</p>
            </div>
        );
    }

    return (
        <div className="productos-catalog">
            <div className="catalog-header">
                <h2>🏪 Catálogo de Productos y Servicios</h2>
                
                <div className="view-controls">
                    <Button
                        variant={viewMode === 'grid' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className="view-btn"
                    >
                        🔲 Vista Grid
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="view-btn"
                    >
                        📋 Vista Lista
                    </Button>
                    {isAdmin && (
                        <Button
                            variant={showEstadisticas ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setShowEstadisticas(!showEstadisticas)}
                            className="view-btn"
                        >
                            {showEstadisticas ? '📊 Ocultar Stats' : '📈 Ver Stats'}
                        </Button>
                    )}
                </div>
            </div>

            {showEstadisticas && isAdmin && (
                <EstadisticasProductos />
            )}

            <ProductoFilters
                onFilterChange={handleFilterChange}
                loading={loading}
            />

            {(error || compraError) && (
                <div className="error-message">
                    <div className="error-icon">❌</div>
                    <h4>¡Oops! Algo salió mal</h4>
                    <p>{error || compraError}</p>
                </div>
            )}

            {loading && productos.length > 0 && (
                <div className="loading-overlay">
                    <div className="loading-spinner">🔄</div>
                    <p>Actualizando productos...</p>
                </div>
            )}

            <div className={`productos-container ${viewMode}`}>
                {productos.length === 0 && !loading ? (
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <h3>No encontramos productos</h3>
                        <p>No se encontraron productos con los filtros aplicados.</p>
                        <p>Intenta ajustar tus criterios de búsqueda.</p>
                    </div>
                ) : (
                    productos.map((producto) => (
                        <ProductoCard
                            key={producto.id || producto._id}
                            producto={producto}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onComprar={handleComprar}
                            onToggleEstado={handleToggleEstado}
                            isAdmin={isAdmin}
                        />
                    ))
                )}
            </div>

            {pagination.totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            <CompraForm
                isOpen={showCompraForm}
                onClose={() => {
                    setShowCompraForm(false);
                    setSelectedProducto(null);
                    clearMessages();
                }}
                onSubmit={handleCompraSubmit}
                producto={selectedProducto}
                loading={compraLoading}
            />

            <ProductoForm
                isOpen={showEditForm}
                onClose={() => {
                    setShowEditForm(false);
                    setSelectedProducto(null);
                }}
                onSubmit={async (productoData) => {
                    const result = await updateProducto(selectedProducto.id || selectedProducto.pid, productoData);
                    if (result.success) {
                        await fetchProductos({ ...filters, page: currentPage });
                        setShowEditForm(false);
                        setSelectedProducto(null);
                    }
                }}
                producto={selectedProducto}
                loading={loading}
                isEdit={true}
            />

            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Confirmar eliminación"
            >
                <div className="delete-confirmation">
                    <p>¿Estás seguro de que quieres eliminar este producto?</p>
                    <p>Esta acción no se puede deshacer.</p>
                    <div className="modal-actions">
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="danger"
                            onClick={confirmDelete}
                        >
                            Eliminar
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ProductosCatalog;
