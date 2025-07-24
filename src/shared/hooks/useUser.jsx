import { useState, useCallback } from 'react';
import { 
    getUserById as getUserByIdRequest, 
    getAllUsers as getAllUsersRequest, 
    deleteUserAdmin as deleteUserAdminRequest, 
    updateUserAdmin as updateUserAdminRequest, 
    updateUserClient as updateUserClientRequest,
    register as registerRequest
} from '../../services/api';

export const useUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        hasNext: false,
        hasPrev: false
    });
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = useCallback(async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllUsersRequest(filters);
            
            if (response.error) {
                const errorMsg = response.err.response?.data?.error || 'Error al obtener usuarios';
                setError(errorMsg);
                return false;
            }
            
            const usersData = response.data.users || response.data.data || response.data;
            const finalUsersData = Array.isArray(usersData) ? usersData : 
                                 (response.data.users ? response.data.users :
                                 (Array.isArray(response.data) ? response.data : []));
            
            setUsers(finalUsersData);
            
            if (response.data.pagination) {
                setPagination(response.data.pagination);
            }
            return true;
        } catch {
            setError('Error inesperado al obtener usuarios');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUserById = useCallback(async (userId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getUserByIdRequest(userId);
            
            if (response.error) {
                const errorMsg = response.err.response?.data?.error || 'Error al obtener el usuario';
                setError(errorMsg);
                return false;
            }
            
            const userData = response.data.success && response.data.user ? response.data.user :
                            response.data.user ? response.data.user :
                            response.data.data ? response.data.data : response.data;
            
            setSelectedUser(userData || null);
            return true;
        } catch {
            setError('Error inesperado al obtener el usuario');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteUser = useCallback(async (userId) => {
        if (!userId) {
            setError('ID de usuario requerido');
            return false;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await deleteUserAdminRequest(userId);
            
            if (response.error) {
                const errorMsg = response.err.response?.data?.error || 
                                response.err.response?.data?.message || 
                                response.err.message || 
                                'Error al eliminar el usuario';
                setError(errorMsg);
                return false;
            }
            
            if (users.length > 0) {
                const filteredUsers = users.filter(user => {
                    const userIdToCompare = getUserId(user);
                    return userIdToCompare !== userId;
                });
                setUsers(filteredUsers);
            }
            
            return true;
        } catch (err) {
            const errorMsg = err.response?.data?.error || 
                            err.response?.data?.message || 
                            err.message || 
                            'Error inesperado al eliminar el usuario';
            setError(errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    }, [users]);

    const getUserId = (user) => {
        return user.uid || user._id || user.id;
    };

    const updateUser = useCallback(async (userId, userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await updateUserAdminRequest(userId, userData);
            
            if (response.error) {
                const errorMsg = response.err.response?.data?.error || 
                                response.err.response?.data?.message || 
                                response.err.message || 
                                'Error al actualizar el usuario';
                setError(errorMsg);
                return false;
            }
            
            const updatedUserData = response.data.success && response.data.user ? response.data.user :
                                   response.data.user ? response.data.user :
                                   response.data.data ? response.data.data : response.data;
            
            if (users.length > 0) {
                const updatedUsers = users.map(user => {
                    const userIdToCompare = getUserId(user);
                    return userIdToCompare === userId ? { ...user, ...updatedUserData } : user;
                });
                setUsers(updatedUsers);
            }
            
            if (selectedUser && getUserId(selectedUser) === userId) {
                setSelectedUser({ ...selectedUser, ...updatedUserData });
            }
            
            return true;
        } catch {
            setError('Error inesperado al actualizar el usuario');
            return false;
        } finally {
            setLoading(false);
        }
    }, [users, selectedUser]);
    
    const updateProfile = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await updateUserClientRequest(userData);
            if (response.error) {
                setError(response.err.response?.data?.error || 'Error al actualizar el perfil');
                return false;
            }
            
            return true;
        } catch {
            setError('Error inesperado al actualizar el perfil');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const createNewUser = useCallback(async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await registerRequest(userData);
            
            if (response.error) {
                const errorMsg = response.err.response?.data?.error || 
                                response.err.response?.data?.message || 
                                response.err.message || 
                                'Error al crear el usuario';
                setError(errorMsg);
                return false;
            }
            
            const newUserData = response.data.success && response.data.user ? response.data.user :
                               response.data.user ? response.data.user :
                               response.data.data ? response.data.data : response.data;
            
            if (users.length >= 0) {
                setUsers(prevUsers => [...prevUsers, newUserData]);
            }
            
            return { success: true, user: newUserData };
        } catch {
            setError('Error inesperado al crear el usuario');
            return false;
        } finally {
            setLoading(false);
        }
    }, [users]);

    return {
        loading,
        error,
        users,
        selectedUser,
        pagination,
        fetchUsers,
        fetchUserById,
        deleteUser,
        updateUser,
        updateProfile,
        createNewUser
    };
};
