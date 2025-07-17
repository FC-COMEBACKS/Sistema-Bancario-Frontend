import { useState } from 'react';
import { getFavoritos, transferirAFavorito } from '../../services/api';

export function useFavorito() {
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const cargarFavoritos = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getFavoritos();
            if (response.error) {
                setError('Error al cargar los favoritos');
                setFavoritos([]);
            } else {
                setFavoritos(response.data.favoritos || []);
            }
        } catch (err) {
            setError('Error al cargar los favoritos');
            setFavoritos([]);
        } finally {
            setLoading(false);
        }
    };

    const transferirRapido = async (favoritoId, monto, descripcion) => {
        setLoading(true);
        setError('');
        try {
            const response = await transferirAFavorito({ favoritoId, monto, descripcion });
            if (response.error) {
                setError(response.err?.response?.data?.msg || 'Error al realizar la transferencia');
                return null;
            } else {
                return response.data;
            }
        } catch (err) {
            setError('Error al realizar la transferencia');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        favoritos,
        cargarFavoritos,
        loading,
        error,
        setError,
        transferirRapido
    };
}