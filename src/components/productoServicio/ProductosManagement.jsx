import React, { useState, useEffect, useRef } from 'react';
import { useProductoServicio } from '../../shared/hooks';
import ProductoTable from './ProductoTable';
import ProductoFilters from './ProductoFilters';
import ProductoForm from './ProductoForm';
import { Button, Pagination, Loader, Modal } from '../ui';

const ProductosManagement = () => {
    const {
        productos,
        loading,
        error,
        pagination,
        fetchProductos,
        createProducto,
        updateProducto,
        deleteProducto,
        toggleProductoEstado,
        clearError
    } = useProductoServicio();

    const [filters, setFilters] = useState({});
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productoToDelete, setProductoToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [notification, setNotification] = useState(null);
    
    const fetchProductosRef = useRef(fetchProductos);
    fetchProductosRef.current = fetchProductos;

    useEffect(() => {
        const loadProductos = async () => {
            const filtersWithPagination = {
                ...filters,
                page: currentPage,
                limit: 10
            };
            await fetchProductosRef.current(filtersWithPagination);
        };
        
        loadProductos();
    }, [filters, currentPage]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleCreateProducto = () => {
        setSelectedProducto(null);
        setShowForm(true);
        clearError();
    };

    const handleEditProducto = (producto) => {
        setSelectedProducto(producto);
        setShowForm(true);
        clearError();
    };

    const handleDeleteProducto = (productoId) => {
        const producto = productos.find(p => (p.id || p.pid) === productoId);
        setProductoToDelete(producto);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (productoToDelete) {
            const result = await deleteProducto(productoToDelete.id || productoToDelete.pid);
            if (result.success) {
                showNotification('Producto eliminado exitosamente');
                
                const filtersWithPagination = {
                    ...filters,
                    page: currentPage,
                    limit: 10
                };
                await fetchProductosRef.current(filtersWithPagination);
            } else {
                showNotification(result.error, 'error');
            }
        }
        
        setShowDeleteModal(false);
        setProductoToDelete(null);
    };

    const handleToggleEstado = async (productoId) => {
        const result = await toggleProductoEstado(productoId);
        
        if (result.success) {
            showNotification('Estado del producto actualizado exitosamente');
            
            const filtersWithPagination = {
                ...filters,
                page: currentPage,
                limit: 10
            };
            await fetchProductosRef.current(filtersWithPagination);
        } else {
            showNotification(result.error, 'error');
        }
    };

    const handleFormSubmit = async (formData) => {
        let result;
        
        if (selectedProducto) {
            result = await updateProducto(selectedProducto.id || selectedProducto.pid, formData);
        } else {
            result = await createProducto(formData);
        }
        
        if (result.success) {
            showNotification(
                `Producto ${selectedProducto ? 'actualizado' : 'creado'} exitosamente`
            );
            setShowForm(false);
            setSelectedProducto(null);
            
            const filtersWithPagination = {
                ...filters,
                page: currentPage,
                limit: 10
            };
            await fetchProductosRef.current(filtersWithPagination);
        } else {
            showNotification(result.error, 'error');
        }
    };

    if (loading && productos.length === 0) {
        return <Loader />;
    }

    return (
        <div className="productos-management">
            <div className="management-header">
                <h2>Gestión de Productos y Servicios</h2>
                <Button
                    variant="primary"
                    onClick={handleCreateProducto}
                    disabled={loading}
                >
                    Crear Producto
                </Button>
            </div>

            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}

            <ProductoFilters
                onFilterChange={handleFilterChange}
                loading={loading}
            />

            {error && (
                <div className="error-message">
                    <p>Error: {error}</p>
                </div>
            )}

            <ProductoTable
                productos={productos}
                onEdit={handleEditProducto}
                onDelete={handleDeleteProducto}
                onToggleEstado={handleToggleEstado}
                loading={loading}
                isAdmin={true}
            />

            {pagination.totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            <ProductoForm
                isOpen={showForm}
                onClose={() => {
                    setShowForm(false);
                    setSelectedProducto(null);
                    clearError();
                }}
                onSubmit={handleFormSubmit}
                producto={selectedProducto}
                loading={loading}
            />

            <Modal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setProductoToDelete(null);
                }}
                title="Confirmar Eliminación"
            >
                <div className="delete-confirmation">
                    <p>
                        ¿Está seguro que desea eliminar el producto "{productoToDelete?.nombre}"?
                    </p>
                    <p className="warning">Esta acción no se puede deshacer.</p>
                    
                    <div className="modal-actions">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowDeleteModal(false);
                                setProductoToDelete(null);
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="danger"
                            onClick={confirmDelete}
                            disabled={loading}
                        >
                            {loading ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ProductosManagement;
