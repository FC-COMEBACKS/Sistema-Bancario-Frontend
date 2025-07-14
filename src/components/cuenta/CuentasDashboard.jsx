import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Input, Select } from '../ui';
import CuentaTable from './CuentaTable';

const CuentasDashboard = ({
    cuentas,
    loading,
    error,
    pagination,
    fetchCuentas,
    users,
    fetchUsers,
    onEdit,
    onDelete,
    onViewDetails
}) => {
    const [filters, setFilters] = useState({
        tipo: '',
        usuario: '',
        numeroCuenta: '',
        activa: ''
    });

    useEffect(() => {
        if (typeof fetchCuentas === 'function') fetchCuentas();
        if (typeof fetchUsers === 'function') fetchUsers();
    }, [fetchCuentas, fetchUsers]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = () => {
        const searchFilters = {};
        if (filters.tipo) searchFilters.tipo = filters.tipo;
        if (filters.activa !== '') searchFilters.activa = filters.activa === 'true';
        
        fetchCuentas(searchFilters);
    };

    const handleClearFilters = () => {
        setFilters({
            tipo: '',
            usuario: '',
            numeroCuenta: '',
            activa: ''
        });
        fetchCuentas();
    };

    const tipoOptions = [
        { value: '', label: 'Todos los tipos' },
        { value: 'AHORROS', label: 'Ahorros' },
        { value: 'CORRIENTE', label: 'Corriente' }
    ];

    const usuarioOptions = [
        { value: '', label: 'Todos los usuarios' },
        ...users.map(user => ({
            value: user.uid || user._id,
            label: `${user.nombre} (${user.username})`
        }))
    ];

    const estadoOptions = [
        { value: '', label: 'Todos' },
        { value: 'true', label: 'Activas' },
        { value: 'false', label: 'Inactivas' }
    ];

    const filteredCuentas = React.useMemo(() => {
        return cuentas.filter(cuenta => {
            const matchesUsuario = !filters.usuario || 
                cuenta.usuario?.uid === filters.usuario ||
                cuenta.usuario?._id === filters.usuario;
            const matchesNumero = !filters.numeroCuenta || 
                cuenta.numeroCuenta.toLowerCase().includes(filters.numeroCuenta.toLowerCase());
            const matchesTipo = !filters.tipo || cuenta.tipo === filters.tipo;
            const matchesActiva = filters.activa === '' || String(cuenta.activa) === filters.activa;
            return matchesUsuario && matchesNumero && matchesTipo && matchesActiva;
        });
    }, [cuentas, filters.usuario, filters.numeroCuenta, filters.tipo, filters.activa]);

    return (
        <div className="space-y-6">
            {}
            <Card>
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Filtros</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Select
                            label="Tipo de Cuenta"
                            name="tipo"
                            value={filters.tipo}
                            onChange={handleFilterChange}
                            options={tipoOptions}
                        />
                        <Select
                            label="Usuario"
                            name="usuario"
                            value={filters.usuario}
                            onChange={handleFilterChange}
                            options={usuarioOptions}
                        />
                        <Input
                            label="Número de Cuenta"
                            name="numeroCuenta"
                            value={filters.numeroCuenta}
                            onChange={handleFilterChange}
                            placeholder="Buscar por número"
                        />
                        <Select
                            label="Estado"
                            name="activa"
                            value={filters.activa}
                            onChange={handleFilterChange}
                            options={estadoOptions}
                        />
                    </div>
                    <div className="flex space-x-2 mt-4">
                        <Button onClick={handleSearch} disabled={loading}>
                            Buscar
                        </Button>
                        <Button 
                            variant="secondary" 
                            onClick={handleClearFilters}
                            disabled={loading}
                        >
                            Limpiar Filtros
                        </Button>
                    </div>
                </div>
            </Card>

            {}
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-600">
                        {pagination.total} cuenta{pagination.total !== 1 ? 's' : ''} encontrada{pagination.total !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {}
            {error && (
                <Card className="text-center p-8">
                    <div className="text-red-500">
                        <p className="text-lg font-semibold">Error al cargar las cuentas</p>
                        <p className="text-sm text-gray-600 mt-2">{error}</p>
                    </div>
                </Card>
            )}

            {loading && (
                <Card className="text-center p-8">
                    <div className="text-gray-500">
                        <p>Cargando cuentas...</p>
                    </div>
                </Card>
            )}

            {!loading && !error && (
                <>
                    <CuentaTable
                        cuentas={filteredCuentas}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onViewDetails={onViewDetails}
                        loading={loading}
                    />

                    {filteredCuentas.length === 0 && (
                        <Card className="text-center p-8">
                            <div className="text-gray-500">
                                <p className="text-lg font-semibold">No hay cuentas registradas</p>
                                <p className="text-sm text-gray-600 mt-2">
                                    Comienza creando una nueva cuenta bancaria
                                </p>
                            </div>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
};

CuentasDashboard.propTypes = {
    cuentas: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
    pagination: PropTypes.object,
    fetchCuentas: PropTypes.func,
    users: PropTypes.array.isRequired,
    fetchUsers: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onViewDetails: PropTypes.func
};

export default CuentasDashboard;