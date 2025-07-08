import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

/**
 * Hook para manejar el cierre de sesión de usuario
 * @returns {Object} Función de logout
 */
export const useLogout = () => {
  const navigate = useNavigate();
  
  const logout = () => {
    // Eliminar datos de usuario del localStorage
    localStorage.removeItem('user');
    
    // Mostrar mensaje
    toast.success('Sesión cerrada correctamente');
    
    // Disparar un evento personalizado para notificar cambios en localStorage
    const event = new Event('localStorageChange');
    document.dispatchEvent(event);
    
    // Redireccionar a la página de login
    navigate('/auth');
  };
  
  return {
    logout
  };
};
