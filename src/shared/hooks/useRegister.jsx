import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { register as registerRequest } from '../../services';

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const register = async (formData) => {
    setIsLoading(true);
    
    try {
      const response = await registerRequest(formData);
      setIsLoading(false);
      if (response.error) {
        toast.error(response.message || "Error al registrar tu cuenta");
        return false;
      }
      toast.success("¡Registro exitoso! Bienvenido a nuestro sistema.");
      const userData = response.data?.user || {};
      
      if (userData) {
        userData.token = response.data.token;
        const existingRole = userData.rol || userData.role || "CLIENT";
        userData.rol = existingRole;
        userData.role = existingRole;
        
        localStorage.setItem("user", JSON.stringify(userData));
        const event = new Event('localStorageChange');
        document.dispatchEvent(event);
        const userRole = existingRole.toLowerCase();
        console.log("Rol detectado en registro:", existingRole, "convertido a:", userRole);
        if (userRole.includes('admin')) {
          navigate('/dashboard/admin');
        } else {
          navigate('/dashboard/cliente');
        }
      }
      
      return true;
    } catch (err) {
      setIsLoading(false);
      toast.error(err?.message || "Error al registrar usuario");
      return false;
    }
  };

  return {
    register,
    isLoading
  };
};
