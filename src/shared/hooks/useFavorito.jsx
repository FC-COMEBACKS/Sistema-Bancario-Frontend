import { useState } from 'react';
import { 
    getFavoritos, 
    agregarFavorito, 
    actualizarFavorito, 
    eliminarFavorito, 
    transferirAFavorito 
} from '../../services/api';

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
            error('Error al cargar los favoritos:', err);
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
            error('Error al realizar la transferencia:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const agregarAFavoritos = async (numeroCuenta, alias) => {
        setLoading(true);
        setError('');
        try {
            const response = await agregarFavorito({ numeroCuenta, alias });
            if (response.error) {
                const errorMsg = response.err?.response?.data?.msg || 'Error al agregar a favoritos';
                setError(errorMsg);
                return false;
            } else {
                await cargarFavoritos(); 
                return true;
            }
        } catch (err) {
            error('Error al agregar a favoritos:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const actualizarAlias = async (id, alias) => {
        setLoading(true);
        setError('');
        try {
            const response = await actualizarFavorito(id, { alias });
            if (response.error) {
                const errorMsg = response.err?.response?.data?.msg || 'Error al actualizar favorito';
                setError(errorMsg);
                return false;
            } else {
                await cargarFavoritos(); 
                return true;
            }
        } catch (err) {
            error('Error al actualizar favorito:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const eliminarDeFavoritos = async (id) => {
        setLoading(true);
        setError('');
        try {
            const response = await eliminarFavorito(id);
            if (response.error) {
                const errorMsg = response.err?.response?.data?.msg || 'Error al eliminar favorito';
                setError(errorMsg);
                return false;
            } else {
                await cargarFavoritos(); 
                return true;
            }
        } catch (err) {
            error('Error al eliminar favorito:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        favoritos,
        cargarFavoritos,
        agregarAFavoritos,
        actualizarAlias,
        eliminarDeFavoritos,
        loading,
        error,
        setError,
        transferirRapido
    };
}