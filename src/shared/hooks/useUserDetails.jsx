import { useState, useCallback } from 'react';
import { 
    getUserById as getUserByIdRequest, 
    updateUserClient as updateUserClientRequest, 
    updateUserAdmin as updateUserAdminRequest,
    deleteUserClient as deleteUserClientRequest, 
    updatePassword as updatePasswordRequest 
} from '../../services/api';

export const useUserDetails = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userProfile, setUserProfile] = useState(null);

    const fetchCurrentUser = useCallback(async (userId) => {
        if (!userId) {
            setError('ID de usuario no válido');
            return false;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await getUserByIdRequest(userId);
            
            if (response.error) {
                const errorMsg = response.err.response?.data?.error || 'Error al obtener el perfil';
                setError(errorMsg);
                return false;
            }
            
            const userData = response.data.success && response.data.user ? response.data.user :
                            response.data.user ? response.data.user :
                            response.data.data ? response.data.data : response.data;
            
            setUserProfile(userData || null);
            return true;
        } catch {
            setError('Error inesperado al obtener el perfil');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateCurrentUser = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const userStorage = localStorage.getItem('user');
            if (!userStorage) {
                setError('Error: No se encontró información del usuario');
                return false;
            }
            
            const currentUser = JSON.parse(userStorage);
            const userRole = currentUser.rol || currentUser.role;
            const userId = currentUser.uid || currentUser._id || currentUser.id || currentUser.userId;
            
            let response;
            if (userRole === 'ADMIN' || userRole === 'admin') {
                response = await updateUserAdminRequest(userId, userData);
            } else {
                response = await updateUserClientRequest(userData);
            }
            
            if (response.error) {
                const errorMsg = response.err.response?.data?.error || 
                                response.err.response?.data?.message || 
                                response.err.message || 
                                'Error al actualizar el perfil';
                setError(errorMsg);
                return false;
            }
            
            const updatedUserData = response.data.data || response.data.user || response.data;
            
            if (!updatedUserData) {
                setError('Error: No se recibieron datos del usuario actualizado');
                return false;
            }
            
            setUserProfile(updatedUserData);
            
            if (updatedUserData) {
                try {
                    const updatedUser = {
                        ...currentUser,
                        ...updatedUserData
                    };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                } catch (err){
                    err
                }
            }
            
            return true;
        } catch (err) {
            const errorMsg = err.response?.data?.error || 
                            err.response?.data?.message || 
                            err.message || 
                            'Error inesperado al actualizar el perfil';
            setError(errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async (passwordData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await updatePasswordRequest(passwordData);
            if (response.error) {
                setError(response.err.response?.data?.error || 'Error al cambiar la contraseña');
                return false;
            }
            
            return true;
        } catch {
            setError('Error inesperado al cambiar la contraseña');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteAccount = async (password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await deleteUserClientRequest(password);
            if (response.error) {
                setError(response.err.response?.data?.error || 'Error al eliminar la cuenta');
                return false;
            }
            
            localStorage.removeItem('user');
            
            return true;
        } catch {
            setError('Error inesperado al eliminar la cuenta');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        userProfile,
        fetchCurrentUser,
        updateCurrentUser,
        changePassword,
        deleteAccount
    };
};
