import { useState } from 'react';
import { convertirSaldoCuenta, getCuentas } from '../../services/api';

export function useConvertirSaldoCuenta() {
    const [cuentas, setCuentas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resultado, setResultado] = useState(null);

    const cargarCuentas = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getCuentas();
            if (response.error) {
                setError('Error al cargar las cuentas');
                setCuentas([]);
            } else {
                setCuentas(response.data.cuentas || []);
            }
        } catch (err) {
            setError('Error al cargar las cuentas');
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
                setError(response.err?.response?.data?.msg || 'Error al convertir el saldo');
            } else {
                setResultado(response.data);
            }
        } catch (err) {
            setError('Error al convertir el saldo de la cuenta');
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
        setResultado,
        convertirSaldo
    };
}
