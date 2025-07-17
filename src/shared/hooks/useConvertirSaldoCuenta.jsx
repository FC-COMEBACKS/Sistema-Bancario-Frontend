import { useState } from 'react';
import { convertirSaldoCuenta, getCuentaByUsuario } from '../../services/api';

export function useConvertirSaldoCuenta() {
    const [cuentas, setCuentas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resultado, setResultado] = useState(null);

    const cargarCuentas = async () => {
        setLoading(true);
        setError('');
        try {
            const userDetails = localStorage.getItem('user');
            if (!userDetails) {
                setError('Usuario no autenticado');
                setCuentas([]);
                return;
            }
            
            const userData = JSON.parse(userDetails);
            const userId = userData.uid || userData._id;
            
            if (!userId) {
                setError('ID de usuario no encontrado');
                setCuentas([]);
                return;
            }

            const response = await getCuentaByUsuario(userId);
            
            if (response.error) {
                const errorMessage = response.err?.response?.data?.msg || 
                                   response.err?.message || 
                                   'Error al cargar las cuentas';
                setError(errorMessage);
                setCuentas([]);
            } else {
                const cuentaData = response.data.cuenta;
                
                if (cuentaData) {
                    const cuentasArray = Array.isArray(cuentaData) ? cuentaData : [cuentaData];
                    setCuentas(cuentasArray);
                } else {
                    setCuentas([]);
                }
            }
        } catch (err) {
            error('Error al cargar las cuentas:', err);
            setCuentas([]);
        } finally {
            setLoading(false);
        }
    };

    const convertirSaldo = async (cuentaId, divisaDestino) => {
        setLoading(true);
        setError('');
        setResultado(null);
        try {
            const response = await convertirSaldoCuenta({ cuentaId, divisaDestino });
            
            if (response.error) {
                const errorMessage = response.err?.response?.data?.msg || 
                                   response.err?.message || 
                                   'Error al convertir el saldo';
                setError(errorMessage);
            } else {
                setResultado(response.data);
            }
        } catch (err) {
            error('Error en convertirSaldo:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        cuentas,
        cargarCuentas,
        loading,
        error,
        setError,
        resultado,
        convertirSaldo
    };
}
