import { useState } from 'react';
import { getDivisas, agregarDivisa, actualizarTasasDivisa, restaurarTasasOficiales } from '../../services/api';

export function useDivisasManagement() {
    const [divisas, setDivisas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const cargarDivisas = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getDivisas();
            if (response.error) {
                setError('Error al cargar las divisas');
                setDivisas([]);
            } else {
                setDivisas(response.data.divisas || []);
            }
        } catch (err) {
            setError('Error al cargar las divisas');
            setDivisas([]);
        } finally {
            setLoading(false);
        }
    };

    const agregarOActualizarDivisa = async (formData, editingDivisa) => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            let response;
            if (editingDivisa) {
                response = await actualizarTasasDivisa({
                    codigo: formData.codigo,
                    nombre: formData.nombre,
                    tasaEnQuetzales: parseFloat(formData.tasaEnQuetzales)
                });
            } else {
                response = await agregarDivisa({
                    codigo: formData.codigo,
                    nombre: formData.nombre,
                    tasaEnQuetzales: parseFloat(formData.tasaEnQuetzales)
                });
            }
            if (response.error) {
                setError(response.err?.response?.data?.msg || 'Error al guardar la divisa');
            } else {
                setSuccess(editingDivisa ? 'Divisa actualizada correctamente' : 'Divisa agregada correctamente');
                await cargarDivisas();
            }
        } catch (err) {
            setError('Error al guardar la divisa');
        } finally {
            setLoading(false);
        }
    };

    const restaurarTasas = async () => {
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
        agregarOActualizarDivisa,
        restaurarTasas
    };
}
