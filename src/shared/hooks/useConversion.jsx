import { useState } from 'react';
import { convertirMonto, convertirSaldoCuenta } from '../../services/api';

export const useConversion = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resultado, setResultado] = useState(null);

    const convertir = async (monto, divisaOrigen, divisaDestino) => {
        if (!monto || monto <= 0) {
            setError('Ingrese un monto válido');
            return null;
        }

        if (divisaOrigen === divisaDestino) {
            setError('Las divisas de origen y destino deben ser diferentes');
            return null;
        }

        setLoading(true);
        setError('');

        try {
            const response = await convertirMonto({
                monto: parseFloat(monto),
                divisaOrigen,
                divisaDestino
            });

            if (response.error) {
                setError(response.err?.response?.data?.msg || 'Error al realizar la conversión');
                setResultado(null);
                return null;
            } else {
                setResultado(response.data);
                return response.data;
            }
        } catch (err) {
            setError('Error al realizar la conversión');
            setResultado(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const convertirSaldo = async (cuentaId, divisaDestino) => {
        if (!cuentaId) {
            setError('Seleccione una cuenta');
            return null;
        }

        if (!divisaDestino) {
            setError('Seleccione la divisa de destino');
            return null;
        }

        if (divisaDestino === 'GTQ') {
            setError('El saldo ya está en Quetzales');
            return null;
        }

        setLoading(true);
        setError('');

        try {
            const response = await convertirSaldoCuenta({
                cuentaId,
                divisaDestino
            });

            if (response.error) {
                setError(response.err?.response?.data?.msg || 'Error al convertir el saldo');
                setResultado(null);
                return null;
            } else {
                setResultado(response.data);
                return response.data;
            }
        } catch (err) {
            setError('Error al convertir el saldo de la cuenta');
            setResultado(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const limpiarResultado = () => {
        setResultado(null);
        setError('');
    };

    const limpiarError = () => {
        setError('');
    };

    return {
        loading,
        error,
        resultado,
        convertir,
        convertirSaldo,
        limpiarResultado,
        limpiarError
    };
};