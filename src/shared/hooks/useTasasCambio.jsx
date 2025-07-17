import { useState } from 'react';
import { getDivisas, restaurarTasasOficiales } from '../../services/api';

export function useTasasCambio() {
    const [divisas, setDivisas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const cargarDivisas = async (filtro = '') => {
        setLoading(true);
        setError('');
        try {
            const response = await getDivisas(filtro);
            if (response.error) {
                setError('Error al cargar las tasas de cambio');
                setDivisas([]);
            } else {
                setDivisas(response.data.divisas || []);
            }
        } catch (err) {
            setError('Error al cargar las tasas de cambio');
            setDivisas([]);
        } finally {
            setLoading(false);
        }
    };

    const restaurarTasas = async (user) => {
        if (!user || user.rol !== 'ADMIN') {
            setError('Solo los administradores pueden restaurar las tasas');
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await restaurarTasasOficiales();
            if (response.error) {
                setError(response.err?.response?.data?.msg || 'Error al restaurar las tasas');
            } else {
                setSuccess('Tasas de cambio restauradas correctamente');
                await cargarDivisas();
            }
        } catch (err) {
            setError('Error al restaurar las tasas oficiales');
        } finally {
            setLoading(false);
        }
    };

    return {
        divisas,
        cargarDivisas,
        loading,
        error,
        setError,
        success,
        setSuccess,
        restaurarTasas
    };
}
