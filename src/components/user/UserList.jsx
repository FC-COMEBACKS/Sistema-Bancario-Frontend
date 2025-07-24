import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Pagination, Card } from '../ui';
import DeleteButton from '../DeleteButton';
import EditButton from '../EditButton';
import { useUser } from '../../shared/hooks';

const UserList = ({ onEdit }) => {
    const { users, pagination, loading, error, fetchUsers, deleteUser } = useUser();
    const [filters, setFilters] = useState({
        rol: '',
        estado: '',
        nombre: '',
        email: '',
        page: 1,
        limit: 10
    });

    const getUserId = (user) => {
        return user.uid || user._id || user.id;
    };

    const loadUsers = useCallback(() => {
        fetchUsers(filters);
    }, [fetchUsers, filters]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadUsers();
        }, 300); 

        return () => clearTimeout(timeoutId);
    }, [loadUsers]);

    const handlePageChange = (page) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    };

    const handleClearFilters = () => {
        setFilters({
            rol: '',
            estado: '',
            nombre: '',
            email: '',
            page: 1,
            limit: 10
        });
    };

    const handleDelete = async (id) => {
        if (!id) {
            alert('ID de usuario no válido');
            return;
        }
        
        if (window.confirm('¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.')) {
            try {
                const success = await deleteUser(id);
                
                if (success) {
                    loadUsers();
                    alert('Usuario eliminado correctamente');
                } else {
                    alert('Error al eliminar el usuario. Por favor, inténtelo de nuevo.');
                }
            } catch (error) {
                alert('Error inesperado al eliminar el usuario: ' + (error.message || 'Error desconocido'));
            }
        }
    };

    if (error) {
        return (
            <Card className="mb-4">
                <div className="alert alert-danger">{error}</div>
            </Card>
        );
    }

    return (
        <div className="user-list">
            {/* Sección de Filtros */}
            <div className="filters-section">
                <h3 className="filters-title">Filtros</h3>
                
                <div className="filters-grid">
                    <div className="filter-group">
                        <label>Rol</label>
                        <select 
                            name="rol" 
                            value={filters.rol} 
                            onChange={handleFilterChange}
                            className="filter-select"
                        >
                            <option value="">Todos</option>
                            <option value="ADMIN">Administrador</option>
                            <option value="CLIENT">Cliente</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Estado</label>
                        <select 
                            name="estado" 
                            value={filters.estado} 
                            onChange={handleFilterChange}
                            className="filter-select"
                        >
                            <option value="">Todos</option>
                            <option value="ACTIVO">Activo</option>
                            <option value="INACTIVO">Inactivo</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Nombre</label>
                        <input 
                            type="text" 
                            name="nombre" 
                            value={filters.nombre} 
                            onChange={handleFilterChange}
                            className="filter-input"
                        />
                    </div>

                    <div className="filter-group">
                        <label>Email</label>
                        <input 
                            type="text" 
                            name="email" 
                            value={filters.email} 
                            onChange={handleFilterChange}
                            className="filter-input"
                        />
                    </div>
                </div>

                <div className="filters-actions">
                    <button 
                        className="actualizar-btn"
                        onClick={loadUsers}
                    >
                        Actualizar
                    </button>
                </div>
            </div>

            {/* Tabla de usuarios */}
            <div className="users-table-container">
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                    </div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : users.length === 0 ? (
                    <div className="no-users-message">No se encontraron usuarios</div>
                ) : (
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={getUserId(user) || index}>
                                    <td>{user.nombre || 'N/A'}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`role-badge ${user.rol?.toLowerCase()}`}>
                                            {user.rol}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${user.estado?.toLowerCase()}`}>
                                            {user.estado || 'No especificado'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className="edit-btn"
                                                onClick={() => {
                                                    const userId = getUserId(user);
                                                    if (onEdit && userId) {
                                                        onEdit(userId);
                                                    }
                                                }}
                                                title="Editar"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                className="delete-btn"
                                                onClick={() => {
                                                    const userId = getUserId(user);
                                                    if (userId) {
                                                        handleDelete(userId);
                                                    }
                                                }}
                                                title="Eliminar"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                
                {pagination && pagination.totalPages > 1 && (
                    <div className="pagination-container">
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserList;
