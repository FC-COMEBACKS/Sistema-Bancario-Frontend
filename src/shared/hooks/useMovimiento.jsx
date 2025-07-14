import { useState, useCallback } from 'react';
import { 
    getAllMovimientos as getAllMovimientosRequest,
    realizarTransferencia as realizarTransferenciaRequest,
    realizarDeposito as realizarDepositoRequest,
    revertirDeposito as revertirDepositoRequest,
    realizarCredito as realizarCreditoRequest,
    comprarProducto as comprarProductoRequest,
    getHistorialCuenta as getHistorialCuentaRequest,
    getMovimientoById as getMovimientoByIdRequest
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

    const clearMessages = useCallback(() => {
        setError(null);
        setSuccess(false);
    }, []);

    const handleCredito = useCallback(async (creditoData) => {
        setLoading(true);
        clearMessages();
        try {
            const response = await realizarCreditoRequest(creditoData);
            if (response.error) {
                setError(response.err?.response?.data?.msg || 'Error al realizar crédito');
                return false;
            }
            setSuccess(true);
            return true;
        } catch {
            setError('Error al realizar crédito');
            return false;
        } finally {
            setLoading(false);
        }
    }, [clearMessages]);

const fetchMovimientosCliente = useCallback(async (filters = {}) => {
    setLoading(true);
    clearMessages();
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const filtros = { ...filters };
        if (user && user._id) {
            filtros.usuario = user._id;
        }
        const response = await getAllMovimientosRequest(filtros);
        if (response.error) {
            setError(response.err?.response?.data?.msg || 'Error al obtener movimientos');
            setMovimientos([]);
            return;
        }
        setMovimientos(response.data?.movimientos || []);
        setPagination(prev => ({
            ...prev,
            total: response.data?.total || 0,
            currentPage: filtros.pagina || 1,
            totalPages: Math.ceil((response.data?.total || 0) / (filtros.limite || 10))
        }));
    } catch {
        setError('Error al obtener movimientos del cliente');
        setMovimientos([]);
    } finally {
        setLoading(false);
    }
}, [clearMessages]);

    const fetchMovimientos = useCallback(async (filters = {}) => {
        setLoading(true);
        clearMessages();
        try {
            const response = await getAllMovimientosRequest(filters);
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

    const fetchMovimientoById = useCallback(async (movimientoId) => {
        setLoading(true);
        clearMessages();
        try {
            const response = await getMovimientoByIdRequest(movimientoId);
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

    const fetchHistorialCuenta = useCallback(async (cuentaId) => {
        setLoading(true);
        clearMessages();
        try {
            const response = await getHistorialCuentaRequest(cuentaId);
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

    const handleTransferencia = useCallback(async (transferenciaData) => {
        setLoading(true);
        clearMessages();
        try {
            const response = await realizarTransferenciaRequest(transferenciaData);
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

    const handleDeposito = useCallback(async (depositoData) => {
        setLoading(true);
        clearMessages();
        try {
            const response = await realizarDepositoRequest(depositoData);
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

    const handleRevertirDeposito = useCallback(async (movimientoId) => {
        setLoading(true);
        clearMessages();
        try {
            const response = await revertirDepositoRequest(movimientoId);
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

    const handleComprarProducto = useCallback(async (compraData) => {
        setLoading(true);
        clearMessages();
        try {
            const response = await comprarProductoRequest(compraData);
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
        movimientos,
        movimiento,
        loading,
        error,
        success,
        pagination,
        fetchMovimientos,
        fetchMovimientoById,
        fetchHistorialCuenta,
        fetchMovimientosCliente,
        handleTransferencia,
        handleDeposito,
        handleRevertirDeposito,
        handleComprarProducto,
        handleCredito,
        clearMessages,
        resetStates
    };
};
