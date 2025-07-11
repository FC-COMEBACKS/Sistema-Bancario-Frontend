import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './topbar.css';

const getPageTitle = (pathname) => {
  switch (pathname) {
    case '/': return 'Dashboard';
    case '/usuarios': return 'Usuarios';
    case '/mi-perfil': return 'Mi Perfil';
    case '/cuenta': return 'Cuentas';
    case '/movimiento': return 'Transferencias';
    case '/favorito': return 'Favoritos';
    case '/producto': return 'Productos';
    case '/settings': return 'Configuración';
    default: return 'Dashboard';
  }
};

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = getPageTitle(location.pathname);
  
  const handleProfileClick = () => {
    navigate('/mi-perfil');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    navigate('/auth');
  };
  
  return (
    <div className="topbar">
      <h1 className="page-title">{pageTitle}</h1>
      <div className="user-profile-container">
        <div 
          className="user-avatar" 
          onClick={handleProfileClick}
          title="Ir a mi perfil"
        >
          U
        </div>
        <button 
          className="logout-btn"
          onClick={handleLogout}
          title="Cerrar Sesión"
        >
          Salir
        </button>
      </div>
    </div>
  );
};

export default Topbar;