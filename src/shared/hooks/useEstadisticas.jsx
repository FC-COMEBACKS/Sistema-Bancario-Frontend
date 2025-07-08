import { useState, useEffect } from 'react';
import {
    getEstadisticasGenerales as getEstadisticasGeneralesRequest,
    getMovimientosRecientes as getMovimientosRecientesRequest,
    getEstadisticasMovimientos as getEstadisticasMovimientosRequest,
    getEstadisticasUsuarios as getEstadisticasUsuariosRequest,
    getEstadisticasProductos as getEstadisticasProductosRequest
} from '../../services';
import toast from 'react-hot-toast';

export const useEstadisticas = () => {
    const [estadisticasGenerales, setEstadisticasGenerales] = useState(null);
    const [movimientosRecientes, setMovimientosRecientes] = useState([]);
    const [estadisticasMovimientos, setEstadisticasMovimientos] = useState(null);
    const [estadisticasUsuarios, setEstadisticasUsuarios] = useState(null);
    const [estadisticasProductos, setEstadisticasProductos] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const fetchEstadisticasGenerales = async () => {
        setIsLoading(true);
        try {
            const response = await getEstadisticasGeneralesRequest();
            if (response.error) {
                toast.error("Error al cargar estadísticas generales");
                setEstadisticasGenerales(null);
            } else {
                setEstadisticasGenerales(response.data?.estadisticas || response.estadisticas || null);
            }
        } catch (err) {
            toast.error("Error al cargar estadísticas generales " + err.message);
            setEstadisticasGenerales(null);
        }
        setIsLoading(false);
    };

    const fetchMovimientosRecientes = async (limit = 10) => {
        setIsLoading(true);
        try {
            const response = await getMovimientosRecientesRequest(limit);
            if (response.error) {
                toast.error("Error al cargar movimientos recientes");
                setMovimientosRecientes([]);
            } else {
                setMovimientosRecientes(response.data?.movimientos || response.movimientos || []);
            }
        } catch (err) {
            toast.error("Error al cargar movimientos recientes " + err.message);
            setMovimientosRecientes([]);
        }
        setIsLoading(false);
    };

    const fetchEstadisticasMovimientos = async (periodo = 'mensual') => {
        setIsLoading(true);
        try {
            const response = await getEstadisticasMovimientosRequest(periodo);
            if (response.error) {
                toast.error("Error al cargar estadísticas de movimientos");
                setEstadisticasMovimientos(null);
            } else {
                setEstadisticasMovimientos(response.data?.estadisticas || response.estadisticas || null);
            }
        } catch (err) {
            toast.error("Error al cargar estadísticas de movimientos " + err.message);
            setEstadisticasMovimientos(null);
        }
        setIsLoading(false);
    };

    const fetchEstadisticasUsuarios = async () => {
        setIsLoading(true);
        try {
            const response = await getEstadisticasUsuariosRequest();
            if (response.error) {
                toast.error("Error al cargar estadísticas de usuarios");
                setEstadisticasUsuarios(null);
            } else {
                setEstadisticasUsuarios(response.data?.estadisticas || response.estadisticas || null);
            }
        } catch (err) {
            toast.error("Error al cargar estadísticas de usuarios " + err.message);
            setEstadisticasUsuarios(null);
        }
        setIsLoading(false);
    };

    const fetchEstadisticasProductos = async () => {
        setIsLoading(true);
        try {
            const response = await getEstadisticasProductosRequest();
            if (response.error) {
                toast.error("Error al cargar estadísticas de productos");
                setEstadisticasProductos(null);
            } else {
                setEstadisticasProductos(response.data?.estadisticas || response.estadisticas || null);
            }
        } catch (err) {
            toast.error("Error al cargar estadísticas de productos " + err.message);
            setEstadisticasProductos(null);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const loadAllStats = async () => {
            setIsLoading(true);
            await Promise.all([
                fetchEstadisticasGenerales(),
                fetchMovimientosRecientes(),
                fetchEstadisticasMovimientos()
            ]);
            setIsLoading(false);
        };
        
        loadAllStats();
    }, []);

    return {
        estadisticasGenerales,
        movimientosRecientes,
        estadisticasMovimientos,
        estadisticasUsuarios,
        estadisticasProductos,
        isLoading,
        fetchEstadisticasGenerales,
        fetchMovimientosRecientes,
        fetchEstadisticasMovimientos,
        fetchEstadisticasUsuarios,
        fetchEstadisticasProductos
    };
};
