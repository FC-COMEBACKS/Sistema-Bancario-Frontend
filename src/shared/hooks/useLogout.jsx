import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const useLogout = () => {
  const navigate = useNavigate();
  
  const logout = () => {
    localStorage.removeItem('user');
    toast.success('Sesión cerrada correctamente');
    const event = new Event('localStorageChange');
    document.dispatchEvent(event);
    navigate('/auth');
  };
  
  return {
    logout
  };
};
