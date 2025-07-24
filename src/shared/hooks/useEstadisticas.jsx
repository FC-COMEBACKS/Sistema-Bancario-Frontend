import { useState, useEffect } from 'react';
import {
    getEstadisticasGenerales as getEstadisticasGeneralesRequest,
    getMovimientosRecientes as getMovimientosRecientesRequest,
    getEstadisticasMovimientos as getEstadisticasMovimientosRequest,
    getEstadisticasUsuarios as getEstadisticasUsuariosRequest,
    getEstadisticasProductos as getEstadisticasProductosRequest
} from '../../services';

export const useEstadisticas = () => {
    const [estadisticasGenerales, setEstadisticasGenerales] = useState(null);
    const [movimientosRecientes, setMovimientosRecientes] = useState([]);
    const [estadisticasMovimientos, setEstadisticasMovimientos] = useState(null);
    const [estadisticasUsuarios, setEstadisticasUsuarios] = useState(null);
    const [estadisticasProductos, setEstadisticasProductos] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasErrors, setHasErrors] = useState(false);
    
    const fetchEstadisticasGenerales = async () => {
        try {
            const response = await getEstadisticasGeneralesRequest();
            if (response && !response.error) {
                const estadisticas = response.data?.estadisticas || response.estadisticas || response.data || response;
                setEstadisticasGenerales(estadisticas);
            } else {
                setHasErrors(true);
            }
        } catch (error) {
            console.error('Error al cargar estadísticas generales:', error);
            setHasErrors(true);
        }
    };

    const fetchMovimientosRecientes = async (limit = 10) => {
        try {
            const response = await getMovimientosRecientesRequest(limit);
            if (response.error) {
                console.error('Error al cargar movimientos recientes:', response.err);
                setMovimientosRecientes([]);
                setHasErrors(true);
            } else {
                setMovimientosRecientes(response.data?.movimientos || response.movimientos || []);
            }
        } catch {
            console.error('Error al cargar movimientos recientes');
            setMovimientosRecientes([]);
            setHasErrors(true);
        }
    };

    const fetchEstadisticasMovimientos = async (periodo = 'mensual') => {
        try {
            const response = await getEstadisticasMovimientosRequest(periodo);
            if (response.error) {
                console.error('Error al cargar estadísticas de movimientos:', response.err);
                setEstadisticasMovimientos(null);
                setHasErrors(true);
            } else {
                setEstadisticasMovimientos(response.data?.estadisticas || response.estadisticas || null);
            }
        } catch {
            console.error('Error al cargar estadísticas de movimientos');
            setEstadisticasMovimientos(null);
            setHasErrors(true);
        }
    };

    const fetchEstadisticasUsuarios = async () => {
        try {
            const response = await getEstadisticasUsuariosRequest();
            if (response.error) {
                console.error('Error al cargar estadísticas de usuarios:', response.err);
                setEstadisticasUsuarios(null);
                setHasErrors(true);
            } else {
                setEstadisticasUsuarios(response.data?.estadisticas || response.estadisticas || null);
            }
        } catch {
            console.error('Error al cargar estadísticas de usuarios');
            setEstadisticasUsuarios(null);
            setHasErrors(true);
        }
    };

    const fetchEstadisticasProductos = async () => {
        try {
            const response = await getEstadisticasProductosRequest();
            if (response.error) {
                console.error('Error al cargar estadísticas de productos:', response.err);
                setEstadisticasProductos(null);
                setHasErrors(true);
            } else {
                setEstadisticasProductos(response.data?.estadisticas || response.estadisticas || null);
            }
        } catch {
            console.error('Error al cargar estadísticas de productos');
            setEstadisticasProductos(null);
            setHasErrors(true);
        }
    };

    useEffect(() => {
        const loadAllStats = async () => {
            setIsLoading(true);
            setHasErrors(false);
            
            try {
                await fetchEstadisticasGenerales();
            } catch (error) {
                console.error('Error cargando estadísticas:', error);
                setHasErrors(true);
            }
            
            setIsLoading(false);
        };
    
        const timeoutId = setTimeout(loadAllStats, 500);
        
        return () => clearTimeout(timeoutId);
    }, []);

    return {
        estadisticasGenerales,
        movimientosRecientes,
        estadisticasMovimientos,
        estadisticasUsuarios,
        estadisticasProductos,
        isLoading,
        hasErrors,
        fetchEstadisticasGenerales,
        fetchMovimientosRecientes,
        fetchEstadisticasMovimientos,
        fetchEstadisticasUsuarios,
        fetchEstadisticasProductos
    };
};
