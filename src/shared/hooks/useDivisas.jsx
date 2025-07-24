import { useState, useEffect } from 'react';
import { getDivisas } from '../../services/api';

export const useDivisas = (filtro = '') => {
    const [divisas, setDivisas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const cargarDivisas = async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await getDivisas(filtro);
            
            if (response.error) {
                setError('Error al cargar las divisas');
                return;
            }
            
            const todasLasDivisas = [
                { codigo: 'GTQ', nombre: 'Quetzal Guatemalteco', tasaEnQuetzales: 1 },
                ...response.data.divisas
            ];
            
            setDivisas(todasLasDivisas);
        } catch (err) {
            setError('Error al cargar las divisas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDivisas();
    }, [filtro]);

    const refrescarDivisas = () => {
        cargarDivisas();
    };

    const getDivisaByCode = (codigo) => {
        return divisas.find(divisa => divisa.codigo === codigo);
    };

    const getDivisasOptions = (includeGTQ = true) => {
        let divisasParaOpciones = divisas;
        
        if (!includeGTQ) {
            divisasParaOpciones = divisas.filter(d => d.codigo !== 'GTQ');
        }
        
        return divisasParaOpciones.map(divisa => ({
            value: divisa.codigo,
            label: `${divisa.codigo} - ${divisa.nombre}`
        }));
    };

    return {
        divisas,
        loading,
        error,
        refrescarDivisas,
        getDivisaByCode,
        getDivisasOptions
    };
};