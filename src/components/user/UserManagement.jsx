import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Loader } from '../ui';
import UserList from './UserList';
import UserForm from './UserForm';
import UserDetails from './UserDetails';
import { useUser } from '../../shared/hooks';

const UserManagement = () => {
    const { loading, error, selectedUser, fetchUserById, updateUser, deleteUser, createNewUser } = useUser();
    const [mode, setMode] = useState('list'); 
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [actionMessage, setActionMessage] = useState({ text: '', type: '' });

    const loadUserById = useCallback(() => {
        if (selectedUserId && (mode === 'view' || mode === 'edit')) {
            fetchUserById(selectedUserId);
        }
    }, [selectedUserId, mode, fetchUserById]);

    useEffect(() => {
        loadUserById();
    }, [loadUserById]);

    const handleEditUser = (userId) => {
        setSelectedUserId(userId);
        setMode('edit');
    };

    const handleCreateUser = () => {
        setSelectedUserId(null);
        setMode('create');
    };

    const handleBack = () => {
        setMode('list');
        setSelectedUserId(null);
        setActionMessage({ text: '', type: '' });
    };

    const handleSubmit = async (userData) => {
        try {
            if (mode === 'edit' && selectedUserId) {
                const success = await updateUser(selectedUserId, userData);
                
                if (success) {
                    setActionMessage({ 
                        text: 'Usuario actualizado exitosamente', 
                        type: 'success' 
                    });
                    await fetchUserById(selectedUserId);
                    setMode('view');
                    return true;
                } else {
                    setActionMessage({
                        text: 'Error al actualizar el usuario',
                        type: 'danger'
                    });
                    return false;
                }
            } else if (mode === 'create') {
                const result = await createNewUser(userData);
                
                if (result && result.success) {
                    setActionMessage({ 
                        text: 'Usuario creado exitosamente', 
                        type: 'success' 
                    });
                    setMode('list');
                    return true;
                } else {
                    setActionMessage({
                        text: 'Error al crear el usuario',
                        type: 'danger'
                    });
                    return false;
                }
            }
            return false;
        } catch {
            setActionMessage({
                text: 'Error inesperado al procesar la solicitud',
                type: 'danger'
            });
            return false;
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUserId) return;
        
        if (window.confirm('¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.')) {
            const success = await deleteUser(selectedUserId);
            if (success) {
                setActionMessage({
                    text: 'Usuario eliminado exitosamente',
                    type: 'success'
                });
                setMode('list');
                setSelectedUserId(null);
            }
        }
    };

    const renderHeader = () => {
        let title = 'Administración de Usuarios';
        let actions = (
            <Button variant="primary" onClick={handleCreateUser}>
                Nuevo Usuario
            </Button>
        );

        if (mode === 'view') {
            title = 'Detalles del Usuario';
            actions = (
                <div className="d-flex gap-2">
                    <Button variant="secondary" onClick={handleBack}>
                        Volver
                    </Button>
                    <Button variant="primary" onClick={() => handleEditUser(selectedUserId)}>
                        Editar
                    </Button>
                    <Button variant="danger" onClick={handleDeleteUser}>
                        Eliminar
                    </Button>
                </div>
            );
        } else if (mode === 'edit') {
            title = 'Editar Usuario';
            actions = (
                <Button variant="secondary" onClick={() => setMode('view')}>
                    Cancelar
                </Button>
            );
        } else if (mode === 'create') {
            title = 'Crear Nuevo Usuario';
            actions = (
                <Button variant="secondary" onClick={handleBack}>
                    Cancelar
                </Button>
            );
        }

        return (
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>{title}</h3>
                {actions}
            </div>
        );
    };

    const renderActionMessage = () => {
        if (!actionMessage.text) return null;

        return (
            <div className={`alert alert-${actionMessage.type} mb-4`}>
                {actionMessage.text}
            </div>
        );
    };

    const renderContent = () => {
        if (mode === 'list') {
            return <UserList onEdit={handleEditUser} />;
        }

        if (loading) {
            return (
                <Card>
                    <div className="d-flex justify-content-center my-4">
                        <Loader />
                    </div>
                </Card>
            );
        }

        if (error) {
            return (
                <Card>
                    <div className="alert alert-danger">{error}</div>
                </Card>
            );
        }

        if (mode === 'view' && selectedUser) {
            return <UserDetails userId={selectedUserId} onEdit={() => handleEditUser(selectedUserId)} showEditButton={false} />;
        }

        if ((mode === 'edit' || mode === 'create')) {
            return (
                <UserForm 
                    user={mode === 'edit' ? selectedUser : null} 
                    onSubmit={handleSubmit} 
                    onCancel={mode === 'edit' ? () => setMode('view') : handleBack}
                    isAdmin={true}
                />
            );
        }

        return (
            <Card>
                <div className="text-center my-4">
                    <p>Contenido no disponible</p>
                </div>
            </Card>
        );
    };

    return (
        <div className="user-management">
            {renderHeader()}
            {renderActionMessage()}
            {renderContent()}
        </div>
    );
};

export default UserManagement;
