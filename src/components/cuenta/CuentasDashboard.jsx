import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Input, Select, Loader } from '../ui';
import CuentaTable from './CuentaTable';
import CuentaCard from './CuentaCard';

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
    
    const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'table'

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
        { value: '', label: '🏦 Todos los tipos' },
        { value: 'AHORROS', label: '💰 Ahorros' },
        { value: 'CORRIENTE', label: '💼 Corriente' },
        { value: 'EMPRESARIAL', label: '🏢 Empresarial' }
    ];

    const usuarioOptions = [
        { value: '', label: '👥 Todos los usuarios' },
        ...users.map(user => ({
            value: user.uid || user._id,
            label: `👤 ${user.nombre} (${user.username})`
        }))
    ];

    const estadoOptions = [
        { value: '', label: '📊 Todos los estados' },
        { value: 'true', label: '✅ Activas' },
        { value: 'false', label: '❌ Inactivas' }
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

    const getEstadisticas = () => {
        const total = filteredCuentas.length;
        const activas = filteredCuentas.filter(c => c.activa).length;
        const totalSaldo = filteredCuentas.reduce((sum, c) => sum + (c.saldo || 0), 0);
        const ahorros = filteredCuentas.filter(c => c.tipo === 'AHORROS').length;
        const corrientes = filteredCuentas.filter(c => c.tipo === 'CORRIENTE').length;
        
        return { total, activas, totalSaldo, ahorros, corrientes };
    };

    const stats = getEstadisticas();

    if (loading && cuentas.length === 0) {
        return (
            <div className="loading-state">
                <Loader />
                <h3>🔍 Cargando cuentas...</h3>
                <p>Estamos recopilando la información de todas las cuentas</p>
            </div>
        );
    }

    return (
        <div className="cuentas-dashboard">
            <div className="dashboard-header">
                <div>
                    <h2 className="dashboard-title">📊 Dashboard de Cuentas</h2>
                    <p style={{color: 'var(--text-secondary)', margin: '0.5rem 0 0 0'}}>
                        Gestiona y supervisa todas las cuentas bancarias
                    </p>
                </div>
                <div className="view-toggle">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        title="Vista de tarjetas"
                    >
                        <span className="view-icon">📱</span>
                        <span className="view-text">Tarjetas</span>
                    </button>
                    <button
                        onClick={() => setViewMode('table')}
                        className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                        title="Vista de tabla"
                    >
                        <span className="view-icon">�</span>
                        <span className="view-text">Tabla</span>
                    </button>
                </div>
            </div>

            {/* Estadísticas Rápidas */}
            <div className="estadisticas-rapidas" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <div className="stat-card" style={{
                    background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                    color: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🏦</div>
                    <div style={{fontSize: '2rem', fontWeight: '700'}}>{stats.total}</div>
                    <div style={{fontSize: '0.875rem', opacity: '0.9'}}>Total Cuentas</div>
                </div>
                
                <div className="stat-card" style={{
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    color: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>✅</div>
                    <div style={{fontSize: '2rem', fontWeight: '700'}}>{stats.activas}</div>
                    <div style={{fontSize: '0.875rem', opacity: '0.9'}}>Cuentas Activas</div>
                </div>
                
                <div className="stat-card" style={{
                    background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                    color: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>💰</div>
                    <div style={{fontSize: '1.5rem', fontWeight: '700'}}>
                        {new Intl.NumberFormat('es-GT', {
                            style: 'currency',
                            currency: 'GTQ',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(stats.totalSaldo)}
                    </div>
                    <div style={{fontSize: '0.875rem', opacity: '0.9'}}>Saldo Total</div>
                </div>
            </div>

            {/* Filtros */}
            <div className="filters-section">
                <div className="filters-header">
                    <span className="filters-icon">🔍</span>
                    <h4>Filtros de Búsqueda</h4>
                </div>
                
                <div className="filters-grid">
                    <div className="filter-field">
                        <label>🔢 Número de Cuenta</label>
                        <Input
                            name="numeroCuenta"
                            placeholder="Buscar por número..."
                            value={filters.numeroCuenta}
                            onChange={handleFilterChange}
                        />
                    </div>
                    
                    <div className="filter-field">
                        <label>🏦 Tipo de Cuenta</label>
                        <Select
                            name="tipo"
                            value={filters.tipo}
                            onChange={handleFilterChange}
                            options={tipoOptions}
                        />
                    </div>

                    <div className="filter-field">
                        <label>👤 Usuario</label>
                        <Select
                            name="usuario"
                            value={filters.usuario}
                            onChange={handleFilterChange}
                            options={usuarioOptions}
                        />
                    </div>

                    <div className="filter-field">
                        <label>📊 Estado</label>
                        <Select
                            name="activa"
                            value={filters.activa}
                            onChange={handleFilterChange}
                            options={estadoOptions}
                        />
                    </div>
                </div>
                
                <div className="filters-actions">
                    <Button variant="outline" onClick={handleClearFilters}>
                        🗑️ Limpiar Filtros
                    </Button>
                    <Button variant="primary" onClick={handleSearch}>
                        🔍 Aplicar Filtros
                    </Button>
                </div>
            </div>

            {error && (
                <div className="notification error">
                    <div>
                        <strong>Error al cargar cuentas</strong>
                        <p style={{margin: '0.5rem 0 0 0'}}>{error}</p>
                    </div>
                </div>
            )}

            {loading && cuentas.length > 0 && (
                <div className="notification warning">
                    <strong>Actualizando información...</strong>
                </div>
            )}

            {/* Contenido */}
            {filteredCuentas.length === 0 && !loading ? (
                <div className="empty-state">
                    <span className="empty-icon">🔍</span>
                    <h3>No se encontraron cuentas</h3>
                    <p>No hay cuentas que coincidan con los filtros aplicados.</p>
                    <p>Intenta ajustar los criterios de búsqueda.</p>
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <div className="cuentas-grid">
                            {filteredCuentas.map((cuenta) => (
                                <CuentaCard
                                    key={cuenta.cid || cuenta._id || cuenta.numeroCuenta}
                                    cuenta={cuenta}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onViewDetails={onViewDetails}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="tabla-cuentas">
                            <CuentaTable
                                cuentas={filteredCuentas}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onViewDetails={onViewDetails}
                            />
                        </div>
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