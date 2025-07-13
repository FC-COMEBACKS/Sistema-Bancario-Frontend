import { useState, useCallback } from 'react';
import { 
    getAllMovimientos, 
    realizarTransferencia, 
    realizarDeposito, 
    revertirDeposito, 
    comprarProducto, 
    getHistorialCuenta, 
    getMovimientoById 
} from '../../services/api';

export const useMovimiento = () => {
    const [movimientos, setMovimientos] = useState([]);
    const [movimiento, setMovimiento] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [pagination, setPagination] = useState({
        total: 0,
        currentPage: 1,
        totalPages: 0,
        limit: 10
    });

    // Limpiar mensajes
    const clearMessages = useCallback(() => {
        setError(null);
        setSuccess(false);
    }, []);

    // Obtener todos los movimientos (solo admin)
    const fetchMovimientos = useCallback(async (filters = {}) => {
        setLoading(true);
        clearMessages();
        
        try {
            const response = await getAllMovimientos(filters);
            
            if (response.error) {
                setError(response.err?.response?.data?.msg || 'Error al obtener movimientos');
                setMovimientos([]);
                return;
            }

            setMovimientos(response.data?.movimientos || []);
            setPagination(prev => ({
                ...prev,
                total: response.data?.total || 0,
                currentPage: filters.pagina || 1,
                totalPages: Math.ceil((response.data?.total || 0) / (filters.limite || 10))
            }));
        } catch {
            setError('Error al obtener movimientos');
            setMovimientos([]);
        } finally {
            setLoading(false);
        }
    }, [clearMessages]);

    // Obtener movimiento por ID
    const fetchMovimientoById = useCallback(async (movimientoId) => {
        setLoading(true);
        clearMessages();
        
        try {
            const response = await getMovimientoById(movimientoId);
            
            if (response.error) {
                setError(response.err?.response?.data?.msg || 'Error al obtener movimiento');
                setMovimiento(null);
                return;
            }

            setMovimiento(response.data);
        } catch {
            setError('Error al obtener movimiento');
            setMovimiento(null);
        } finally {
            setLoading(false);
        }
    }, [clearMessages]);

    // Obtener historial de cuenta
    const fetchHistorialCuenta = useCallback(async (cuentaId) => {
        setLoading(true);
        clearMessages();
        
        try {
            const response = await getHistorialCuenta(cuentaId);
            
            if (response.error) {
                setError(response.err?.response?.data?.msg || 'Error al obtener historial de cuenta');
                setMovimientos([]);
                return;
            }

            setMovimientos(response.data?.movimientos || []);
            setPagination(prev => ({
                ...prev,
                total: response.data?.total || 0,
                currentPage: 1,
                totalPages: Math.ceil((response.data?.total || 0) / 10)
            }));
            
            return response.data?.cuenta;
        } catch {
            setError('Error al obtener historial de cuenta');
            setMovimientos([]);
        } finally {
            setLoading(false);
        }
    }, [clearMessages]);

    // Realizar transferencia
    const handleTransferencia = useCallback(async (transferenciaData) => {
        setLoading(true);
        clearMessages();
        
        try {
            const response = await realizarTransferencia(transferenciaData);
            
            if (response.error) {
                setError(response.err?.response?.data?.msg || 'Error al realizar transferencia');
                return false;
            }

            setSuccess(true);
            return true;
        } catch {
            setError('Error al realizar transferencia');
            return false;
        } finally {
            setLoading(false);
        }
    }, [clearMessages]);

    // Realizar depósito
    const handleDeposito = useCallback(async (depositoData) => {
        setLoading(true);
        clearMessages();
        
        try {
            const response = await realizarDeposito(depositoData);
            
            if (response.error) {
                setError(response.err?.response?.data?.msg || 'Error al realizar depósito');
                return false;
            }

            setSuccess(true);
            return true;
        } catch {
            setError('Error al realizar depósito');
            return false;
        } finally {
            setLoading(false);
        }
    }, [clearMessages]);

    // Revertir depósito
    const handleRevertirDeposito = useCallback(async (movimientoId) => {
        setLoading(true);
        clearMessages();
        
        try {
            const response = await revertirDeposito(movimientoId);
            
            if (response.error) {
                setError(response.err?.response?.data?.msg || 'Error al revertir depósito');
                return false;
            }

            setSuccess(true);
            return true;
        } catch {
            setError('Error al revertir depósito');
            return false;
        } finally {
            setLoading(false);
        }
    }, [clearMessages]);

    // Comprar producto
    const handleComprarProducto = useCallback(async (compraData) => {
        setLoading(true);
        clearMessages();
        
        try {
            const response = await comprarProducto(compraData);
            
            if (response.error) {
                setError(response.err?.response?.data?.msg || 'Error al comprar producto');
                return false;
            }

            setSuccess(true);
            return true;
        } catch {
            setError('Error al comprar producto');
            return false;
        } finally {
            setLoading(false);
        }
    }, [clearMessages]);

    // Reset states
    const resetStates = useCallback(() => {
        setMovimientos([]);
        setMovimiento(null);
        setError(null);
        setSuccess(false);
        setPagination({
            total: 0,
            currentPage: 1,
            totalPages: 0,
            limit: 10
        });
    }, []);

    return {
        // Estados
        movimientos,
        movimiento,
        loading,
        error,
        success,
        pagination,
        
        // Métodos
        fetchMovimientos,
        fetchMovimientoById,
        fetchHistorialCuenta,
        handleTransferencia,
        handleDeposito,
        handleRevertirDeposito,
        handleComprarProducto,
        clearMessages,
        resetStates
    };
};
