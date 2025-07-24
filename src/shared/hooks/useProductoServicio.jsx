import { useState, useEffect, useCallback } from 'react';
import { 
    getAllProductos as getAllProductosRequest, 
    getProductoById as getProductoByIdRequest, 
    crearProducto as crearProductoRequest, 
    editarProducto as editarProductoRequest, 
    eliminarProducto as eliminarProductoRequest, 
    cambiarEstadoProducto as cambiarEstadoProductoRequest,
    getEstadisticasProductosServicios as getEstadisticasProductosServiciosRequest
} from '../../services';

export const useProductoServicio = () => {
    const [productos, setProductos] = useState([]);
    const [producto, setProducto] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [productosPopulares, setProductosPopulares] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    });

    const fetchProductos = useCallback(async (filters = {}) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await getAllProductosRequest(filters);
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.error || 'Error al obtener productos');
            }
            
            const processedProductos = (response.data.productos || []).map(producto => ({
                ...producto,
                id: producto.pid || producto._id || producto.id
            }));
            
            setProductos(processedProductos);
            

            const backendPagination = response.data.pagination;
            if (backendPagination) {
                setPagination({
                    currentPage: backendPagination.currentPage || 1,
                    totalPages: backendPagination.totalPages || 1,
                    totalItems: backendPagination.totalItems || 0,
                    itemsPerPage: backendPagination.itemsPerPage || 10
                });
            } else {
                setPagination({
                    currentPage: filters.page || 1,
                    totalPages: Math.ceil((response.data.total || 0) / 10),
                    totalItems: response.data.total || 0,
                    itemsPerPage: 10
                });
            }
        } catch (err) {
            setError(err.message);
            setProductos([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchProductoById = useCallback(async (pid) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await getProductoByIdRequest(pid);
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.error || 'Error al obtener producto');
            }
            
            const processedProducto = {
                ...response.data.productoServicio,
                id: response.data.productoServicio.pid || response.data.productoServicio._id || response.data.productoServicio.id
            };
            
            setProducto(processedProducto);
            return processedProducto;
        } catch (err) {
            setError(err.message);
            setProducto(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const createProducto = useCallback(async (productoData) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await crearProductoRequest(productoData);
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.error || 'Error al crear producto');
            }
            
            return { success: true, data: response.data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProducto = useCallback(async (pid, productoData) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await editarProductoRequest(pid, productoData);
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.error || 'Error al actualizar producto');
            }
            
            return { success: true, data: response.data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteProducto = useCallback(async (pid) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await eliminarProductoRequest(pid);
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.error || 'Error al eliminar producto');
            }
            
            return { success: true, data: response.data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleProductoEstado = useCallback(async (pid) => {
        setLoading(true);
        setError(null);
        
        try {
            const producto = productos.find(p => (p.id || p.pid || p._id) === pid);
            if (!producto) {
                throw new Error('Producto no encontrado');
            }
            const nuevoEstado = !producto.disponible;
            const response = await cambiarEstadoProductoRequest(pid, nuevoEstado);
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.error || 'Error al cambiar estado del producto');
            }
            
            return { success: true, data: response.data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [productos]);

    const fetchCategorias = useCallback(async () => {
        try {
            const categoriasEstaticas = ['PRODUCTO', 'SERVICIO'];
            setCategorias(categoriasEstaticas);
        } catch (err) {
            console.error('Error al obtener categorías:', err.message);
            setCategorias([]);
        }
    }, []);

    const fetchProductosPopulares = useCallback(async (limit = 5) => {
        try {
            const response = await getAllProductosRequest({ limit, disponible: true });
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.error || 'Error al obtener productos populares');
            }
            
            setProductosPopulares(response.data.productos || []);
        } catch (err) {
            console.error('Error al obtener productos populares:', err.message);
            setProductosPopulares([]);
        }
    }, []);

    const fetchEstadisticasProductos = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await getEstadisticasProductosServiciosRequest();
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.error || 'Error al obtener estadísticas');
            }
            
            return response.data.estadisticas;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchCategorias();
    }, [fetchCategorias]);

    return {
        productos,
        producto,
        categorias,
        productosPopulares,
        loading,
        error,
        pagination,
        fetchProductos,
        fetchProductoById,
        createProducto,
        updateProducto,
        deleteProducto,
        toggleProductoEstado,
        fetchCategorias,
        fetchProductosPopulares,
        fetchEstadisticasProductos,
        clearError: () => setError(null),
        clearProducto: () => setProducto(null)
    };
};
