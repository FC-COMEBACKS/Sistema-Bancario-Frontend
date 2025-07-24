import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { login as loginRequest } from '../../services';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (identifier, password) => {
    setIsLoading(true);
    
    try {
      const isEmail = identifier.includes('@');
      const loginData = isEmail 
        ? { email: identifier, password } 
        : { username: identifier, password };
      
      const response = await loginRequest(loginData);
      
      setIsLoading(false);
      
      if (response.error) {
        toast.error("Error al iniciar sesión. Verifica tus credenciales.");
        return;
      }
      toast.success("¡Inicio de sesión exitoso!");
      const userData = response.data.userDetails || response.data.user || {};
      localStorage.setItem('user', JSON.stringify(userData));
      
      const userRole = userData.rol || userData.role || 'CLIENTE';
      localStorage.setItem('userRole', userRole);
      
      const event = new Event('localStorageChange');
      document.dispatchEvent(event);
      
      console.log("Rol de usuario detectado:", userData.rol || userData.role, "guardado como:", userRole);
      
      if (userRole.toLowerCase().includes('admin')) {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard/cliente');
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Error en login:", err);
      toast.error(err?.message || "Error al conectar con el servidor");
    }
  };

  return {
    login,
    isLoading
  };
};
