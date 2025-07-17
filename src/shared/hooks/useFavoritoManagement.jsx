import { useState } from 'react';
import { 
    getFavoritos, 
    agregarFavorito, 
    updateFavorito, 
    deleteFavorito, 
    transferirAFavorito 
} from '../../services/api';

export function useFavoritoManagement() {
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

    const agregarNuevoFavorito = async (numeroCuenta, alias) => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await agregarFavorito({ numeroCuenta, alias });
            if (response.error) {
                setError(response.err?.response?.data?.msg || 'Error al agregar favorito');
            } else {
                setSuccess('Cuenta agregada a favoritos correctamente');
                await cargarFavoritos();
            }
        } catch (err) {
            setError('Error al agregar el favorito');
        } finally {
            setLoading(false);
        }
    };

    const actualizarFavorito = async (id, alias) => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await updateFavorito(id, { alias });
            if (response.error) {
                setError(response.err?.response?.data?.msg || 'Error al actualizar favorito');
            } else {
                setSuccess('Favorito actualizado correctamente');
                await cargarFavoritos();
            }
        } catch (err) {
            setError('Error al actualizar el favorito');
        } finally {
            setLoading(false);
        }
    };

    const eliminarFavorito = async (id) => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await deleteFavorito(id);
            if (response.error) {
                setError(response.err?.response?.data?.msg || 'Error al eliminar favorito');
            } else {
                setSuccess('Favorito eliminado correctamente');
                await cargarFavoritos();
            }
        } catch (err) {
            setError('Error al eliminar el favorito');
        } finally {
            setLoading(false);
        }
    };

    const transferirAContacto = async (favoritoId, monto, descripcion) => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await transferirAFavorito({ favoritoId, monto, descripcion });
            if (response.error) {
                setError(response.err?.response?.data?.msg || 'Error al realizar la transferencia');
            } else {
                setSuccess('Transferencia realizada correctamente');
                return response.data;
            }
        } catch (err) {
            setError('Error al realizar la transferencia');
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
        success,
        setSuccess,
        agregarNuevoFavorito,
        actualizarFavorito,
        eliminarFavorito,
        transferirAContacto
    };
}