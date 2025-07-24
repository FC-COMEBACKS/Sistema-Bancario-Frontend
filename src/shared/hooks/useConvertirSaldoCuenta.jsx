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
                let cuentasArray = [];
                
                if (response.data) {
                    if (response.data.cuentas && Array.isArray(response.data.cuentas)) {
                        cuentasArray = response.data.cuentas;
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
                }
                
                setCuentas(cuentasArray);
            }
        } catch (err) {
            console.error('Error al cargar las cuentas:', err);
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
            console.error('Error en convertirSaldo:', err);
            setError('Error al convertir el saldo');
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
