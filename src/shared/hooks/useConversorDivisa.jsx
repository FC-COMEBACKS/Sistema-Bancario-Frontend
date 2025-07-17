import { useState } from 'react';
import { convertirMonto } from '../../services/api';

export function useConversorDivisa() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resultado, setResultado] = useState(null);

    const convertir = async ({ monto, divisaOrigen, divisaDestino }) => {
        setLoading(true);
        setError('');
        setResultado(null);
        try {
            const response = await convertirMonto({ monto, divisaOrigen, divisaDestino });
            if (response.error) {
                setError(response.err?.response?.data?.msg || 'Error al realizar la conversión');
            } else {
                setResultado(response.data);
            }
        } catch (err) {
            setError('Error al realizar la conversión');
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        setError,
        resultado,
        setResultado,
        convertir
    };
}
