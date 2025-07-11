import { useState, useCallback } from 'react';
import { 
    getCuentas as getCuentasRequest,
    crearCuenta as crearCuentaRequest,
    editarCuenta as editarCuentaRequest,
    getDetallesCuenta as getDetallesCuentaRequest,
    getCuentaById as getCuentaByIdRequest,
    getCuentaPorNumero as getCuentaPorNumeroRequest,
    getCuentaByUsuario as getCuentaByUsuarioRequest,
    deleteCuenta as deleteCuentaRequest
} from '../../services/api';



export const useCuenta = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cuentas, setCuentas] = useState([]);
    const [selectedCuenta, setSelectedCuenta] = useState(null);
    const [pagination, setPagination] = useState({
        total: 0,
        pagina: 1,
        paginas: 0,
        limite: 10
    });

    const fetchCuentas = useCallback(async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCuentasRequest(filters);
            if (response.error) {
                const errorMsg = response.err.response?.data?.msg || 
                                response.err.response?.data?.error || 
                                'Error al obtener las cuentas';
                setError(errorMsg);
                return false;
            }
            const cuentasData = response.data.cuentas || [];
            setCuentas(cuentasData);
            if (response.data.paginacion) {
                setPagination(response.data.paginacion);
            }
            return true;
        } catch {
            setError('Error inesperado al obtener las cuentas');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteCuenta = useCallback(async (cid) => {
        setLoading(true);
        setError(null);
        let success = false;
        try {
            const response = await deleteCuentaRequest(cid);
            if (response.error) {
                const errorMsg = response.err.response?.data?.msg || 
                                response.err.response?.data?.error || 
                                'Error al eliminar la cuenta';
                setError(errorMsg);
                success = false;
            } else {
                setCuentas(prev => prev.filter(cuenta => cuenta.cid !== cid && cuenta._id !== cid && cuenta.numeroCuenta !== cid));
                success = true;
            }
        } catch {
            setError('Error inesperado al eliminar la cuenta');
            success = false;
        } finally {
            await fetchCuentas();
            setLoading(false);
        }
        return success;
    }, [fetchCuentas]);



    const createCuenta = useCallback(async (cuentaData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await crearCuentaRequest(cuentaData);
            
            if (response.error) {
                const errorMsg = response.err.response?.data?.msg || 
                                response.err.response?.data?.error || 
                                response.err.message ||
                                'Error al crear la cuenta';
                setError(errorMsg);
                return false;
            }
            // Refrescar desde la base de datos real
            await fetchCuentas();
            return true;
        } catch {
            setError('Error inesperado al crear la cuenta');
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchCuentas]);

    const updateCuenta = useCallback(async (cid, cuentaData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await editarCuentaRequest(cid, cuentaData);
            
            if (response.error) {
                const errorMsg = response.err.response?.data?.msg || 
                                response.err.response?.data?.error || 
                                'Error al actualizar la cuenta';
                setError(errorMsg);
                return false;
            }
            
            const updatedCuenta = response.data.cuenta;
            setCuentas(prev => prev.map(cuenta => 
                cuenta.cid === cid ? updatedCuenta : cuenta
            ));
            
            if (selectedCuenta && selectedCuenta.cid === cid) {
                setSelectedCuenta(updatedCuenta);
            }
            
            return true;
        } catch {
            setError('Error inesperado al actualizar la cuenta');
            return false;
        } finally {
            setLoading(false);
        }
    }, [selectedCuenta]);

    const fetchCuentaDetails = useCallback(async (cid) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getDetallesCuentaRequest(cid);
            
            if (response.error) {
                const errorMsg = response.err.response?.data?.msg || 
                                response.err.response?.data?.error || 
                                'Error al obtener los detalles de la cuenta';
                setError(errorMsg);
                return false;
            }
            
            setSelectedCuenta(response.data.cuenta);
            return true;
        } catch {
            setError('Error inesperado al obtener los detalles');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCuentaById = useCallback(async (cid) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCuentaByIdRequest(cid);
            
            if (response.error) {
                const errorMsg = response.err.response?.data?.msg || 
                                response.err.response?.data?.error || 
                                'Error al obtener la cuenta';
                setError(errorMsg);
                return false;
            }
            
            setSelectedCuenta(response.data.cuenta);
            return true;
        } catch {
            setError('Error inesperado al obtener la cuenta');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCuentaPorNumero = useCallback(async (numeroCuenta) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCuentaPorNumeroRequest(numeroCuenta);
            
            if (response.error) {
                const errorMsg = response.err.response?.data?.msg || 
                                response.err.response?.data?.error || 
                                'Error al obtener la cuenta';
                setError(errorMsg);
                return false;
            }
            
            setSelectedCuenta(response.data.cuenta);
            return true;
        } catch {
            setError('Error inesperado al obtener la cuenta');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCuentaByUsuario = useCallback(async (uid) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCuentaByUsuarioRequest(uid);
            
            if (response.error) {
                const errorMsg = response.err.response?.data?.msg || 
                                response.err.response?.data?.error || 
                                'Error al obtener las cuentas del usuario';
                setError(errorMsg);
                return false;
            }
            
            // La API devuelve { cuenta: {...} } según Postman
            if (response.data && response.data.cuenta) {
                const cuenta = response.data.cuenta;
                setCuentas([cuenta]); // Convertir a array para consistencia
                setSelectedCuenta(cuenta);
                return true;
            } else {
                setCuentas([]);
                setError('No se encontraron cuentas para este usuario');
                return false;
            }
            
        } catch {
            setError('Error inesperado al obtener las cuentas del usuario');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const clearSelectedCuenta = useCallback(() => {
        setSelectedCuenta(null);
    }, []);

    return {
        loading,
        error,
        cuentas,
        selectedCuenta,
        pagination,
        fetchCuentas,
        createCuenta,
        updateCuenta,
        deleteCuenta,
        fetchCuentaDetails,
        fetchCuentaById,
        fetchCuentaPorNumero,
        fetchCuentaByUsuario,
        clearError,
        clearSelectedCuenta
    };
};
