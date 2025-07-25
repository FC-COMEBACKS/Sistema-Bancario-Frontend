import { useState, useCallback } from 'react';
import { 
    getCuentas as getCuentasRequest,
    crearCuenta as crearCuentaRequest,
    editarCuenta as editarCuentaRequest,
    getDetallesCuenta as getDetallesCuentaRequest,
    getCuentaById as getCuentaByIdRequest,
    getCuentaPorNumero as getCuentaPorNumeroRequest,
    getCuentaByUsuario as getCuentaByUsuarioRequest,
    getMisCuentas as getMisCuentasRequest,
    deleteCuenta as deleteCuentaRequest,
    listarCuentasAgregadas as listarCuentasAgregadasRequest,
    agregarCuentaDeUsuario as agregarCuentaDeUsuarioRequest
} from '../../services/api';



export const useCuenta = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cuentas, setCuentas] = useState([]);
    const [selectedCuenta, setSelectedCuenta] = useState(null);
    const [cuentasAgregadas, setCuentasAgregadas] = useState([]);
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
                                response.err.message ||
                                'Error al obtener las cuentas del usuario';
                console.error('Error fetching cuentas:', errorMsg, response.err);
                setError(errorMsg);
                return false;
            }

            let cuentasArray = [];
            
            if (response.data) {
                if (response.data.cuentas && Array.isArray(response.data.cuentas)) {
                    cuentasArray = response.data.cuentas;
                    console.log('Found cuentas array:', cuentasArray);
                }
                else if (response.data.cuenta) {
                    const cuenta = response.data.cuenta;
                    cuentasArray = Array.isArray(cuenta) ? cuenta : [cuenta];
                }
                else if (Array.isArray(response.data)) {
                    cuentasArray = response.data;
                }
                else if (response.data.numeroCuenta || response.data.cid || response.data._id) {
                    cuentasArray = [response.data];
                }
                else {
                    console.log('No recognized cuenta format in response data');
                }
            }

            console.log('Final cuentas array:', cuentasArray);
            
            if (cuentasArray.length > 0) {
                setCuentas(cuentasArray);
                setSelectedCuenta(cuentasArray[0]);
                return true;
            } else {
                setCuentas([]);
                setSelectedCuenta(null);
                setError('No se encontraron cuentas para este usuario');
                return false;
            }
            
        } catch (error) {
            console.error('Error al obtener cuentas del usuario:', error);
            setError('Error inesperado al obtener las cuentas del usuario');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCuentasDelUsuario = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Obteniendo cuentas del usuario autenticado...');
            
            let response = await getMisCuentasRequest();
            
            if (response.error) {
                console.log('Endpoint directo falló, intentando con getCuentas filtrado...');
                response = await getCuentasRequest({ usuario: 'current' });
            }
            
            if (response.error) {
                const errorMsg = response.err.response?.data?.msg || 
                                response.err.response?.data?.error || 
                                response.err.message ||
                                'Error al obtener las cuentas del usuario';
                console.error('Error fetching cuentas del usuario:', errorMsg, response.err);
                setError(errorMsg);
                return false;
            }

            let cuentasArray = [];
            
            console.log('Respuesta completa del servidor:', response.data);
            
            if (response.data) {
                if (response.data.cuentas && Array.isArray(response.data.cuentas)) {
                    cuentasArray = response.data.cuentas;
                } else if (response.data.data && Array.isArray(response.data.data)) {
                    cuentasArray = response.data.data;
                } else if (Array.isArray(response.data)) {
                    cuentasArray = response.data;
                } else if (response.data.cuenta) {
                    const cuenta = response.data.cuenta;
                    cuentasArray = Array.isArray(cuenta) ? cuenta : [cuenta];
                }
            }

            console.log('Cuentas procesadas:', cuentasArray);
        
            const cuentasActivas = cuentasArray.filter(cuenta => cuenta.activa !== false);
            
            console.log('Cuentas activas filtradas:', cuentasActivas);
            
            if (cuentasActivas.length > 0) {
                setCuentas(cuentasActivas);
                return true;
            } else {
                setCuentas([]);
                setError('No se encontraron cuentas activas para este usuario');
                return false;
            }
            
        } catch (error) {
            console.error('Error al obtener cuentas del usuario autenticado:', error);
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

    const fetchCuentasAgregadas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await listarCuentasAgregadasRequest();
            
            if (response.error) {
                const errorMsg = response.err.response?.data?.msg || 
                                response.err.response?.data?.error || 
                                'Error al obtener las cuentas agregadas';
                setError(errorMsg);
                return false;
            }
            
            setCuentasAgregadas(response.data.cuentasAgregadas || []);
            return true;
        } catch {
            setError('Error inesperado al obtener las cuentas agregadas');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const agregarCuentaDeUsuario = useCallback(async (numeroCuenta) => {
        setLoading(true);
        setError(null);
        try {
            const response = await agregarCuentaDeUsuarioRequest({ numeroCuenta });
            
            if (response.error) {
                const errorMsg = response.err.response?.data?.msg || 
                                response.err.response?.data?.error || 
                                'Error al agregar la cuenta';
                setError(errorMsg);
                return false;
            }
            
            await fetchCuentasAgregadas();
            return true;
        } catch {
            setError('Error inesperado al agregar la cuenta');
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchCuentasAgregadas]);

    return {
        loading,
        error,
        cuentas,
        selectedCuenta,
        pagination,
        cuentasAgregadas,
        fetchCuentas,
        fetchCuentasDelUsuario,
        createCuenta,
        updateCuenta,
        deleteCuenta,
        fetchCuentaDetails,
        fetchCuentaById,
        fetchCuentaPorNumero,
        fetchCuentaByUsuario,
        fetchCuentasAgregadas,
        agregarCuentaDeUsuario,
        clearError,
        clearSelectedCuenta
    };
};