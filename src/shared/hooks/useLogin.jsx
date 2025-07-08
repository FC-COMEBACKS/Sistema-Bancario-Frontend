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
      // Determinar si identifier es un email o nombre de usuario
      const isEmail = identifier.includes('@');
      const loginData = isEmail 
        ? { email: identifier, password } 
        : { username: identifier, password };
      
      const response = await loginRequest(loginData);
      
      setIsLoading(false);
      
      if (response.error) {
        toast.error(response.message || "Error al iniciar sesión");
        return;
      }

      toast.success("¡Inicio de sesión exitoso!");
      
      // Extraer datos del usuario de la respuesta
      console.log("Respuesta login:", response);
      // En el backend, los datos del usuario vienen en response.data.userDetails
      // Y el token ya viene incluido dentro de userDetails
      const userData = response.data.userDetails || response.data.user || {};
      
      // Guardar datos del usuario en localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Disparar un evento personalizado para notificar cambios en localStorage
      const event = new Event('localStorageChange');
      document.dispatchEvent(event);
      
      // Verificar si el rol está en español (rol) o inglés (role)
      // Convertir el rol a minúsculas para comparación insensible a mayúsculas/minúsculas
      const userRole = (userData.rol || userData.role || '').toLowerCase();
      console.log("Rol de usuario detectado:", userData.rol || userData.role, "convertido a:", userRole);
      
      // Redireccionar según el rol del usuario
      if (userRole.includes('admin')) {
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
