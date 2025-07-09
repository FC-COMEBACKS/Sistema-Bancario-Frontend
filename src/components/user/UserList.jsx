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
            <Card className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>Filtros</h4>
                    <div className="d-flex gap-2">
                        <Button variant="secondary" onClick={handleClearFilters}>
                            Limpiar Filtros
                        </Button>
                        <Button variant="primary" onClick={loadUsers}>
                            Actualizar
                        </Button>
                    </div>
                </div>
                <div className="row g-3 mb-3">
                    <div className="col-md-3">
                        <label className="form-label">Rol</label>
                        <select 
                            className="form-select" 
                            name="rol" 
                            value={filters.rol} 
                            onChange={handleFilterChange}
                        >
                            <option value="">Todos</option>
                            <option value="ADMIN">Administrador</option>
                            <option value="CLIENT">Cliente</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Estado</label>
                        <select 
                            className="form-select" 
                            name="estado" 
                            value={filters.estado} 
                            onChange={handleFilterChange}
                        >
                            <option value="">Todos</option>
                            <option value="ACTIVO">Activo</option>
                            <option value="INACTIVO">Inactivo</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Nombre</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="nombre" 
                            value={filters.nombre} 
                            onChange={handleFilterChange}
                            placeholder="Buscar por nombre"
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Email</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="email" 
                            value={filters.email} 
                            onChange={handleFilterChange}
                            placeholder="Buscar por email"
                        />
                    </div>
                </div>
            </Card>

            <Card>
                {/* Tabla de usuarios */}
                {loading ? (
                    <div className="text-center p-4">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : users.length === 0 ? (
                    <div className="alert alert-warning">No se encontraron usuarios</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped">
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
                                        <td>{user.rol}</td>
                                        <td>
                                            <span className={`badge ${user.estado === 'ACTIVO' ? 'bg-success' : 'bg-danger'}`}>
                                                {user.estado || 'No especificado'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="btn-group">
                                                <EditButton onClick={() => {
                                                    const userId = getUserId(user);
                                                    if (onEdit && userId) {
                                                        onEdit(userId);
                                                    } else {
                                                        alert(userId ? 'Función de edición no disponible' : 'No se pudo obtener el ID del usuario');
                                                    }
                                                }} />
                                                <DeleteButton onClick={() => {
                                                    const userId = getUserId(user);
                                                    
                                                    if (!userId) {
                                                        alert('No se pudo obtener el ID del usuario');
                                                        return;
                                                    }
                                                    
                                                    handleDelete(userId);
                                                }} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {pagination && pagination.totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </Card>
        </div>
    );
};

export default UserList;
